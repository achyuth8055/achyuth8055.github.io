const { isPassword } = require('../../../utils/validators');

const Errors = {
  EMAIL_ALREADY_IN_USE: {
    emailAlreadyInUse: 'Email already in use',
  },
  USERNAME_ALREADY_IN_USE: {
    usernameAlreadyInUse: 'Username already in use',
  },
  ACTIVE_LIMIT_REACHED: {
    activeLimitReached: 'Active limit reached',
  },
};

module.exports = {
  inputs: {
    email: {
      type: 'string',
      maxLength: 256,
      isEmail: true,
      required: true,
    },
    password: {
      type: 'string',
      maxLength: 256,
      custom: isPassword,
      required: true,
    },
    name: {
      type: 'string',
      maxLength: 128,
      required: true,
    },
    username: {
      type: 'string',
      isNotEmptyString: true,
      minLength: 3,
      maxLength: 16,
      regex: /^[a-zA-Z0-9]+((_|\.)?[a-zA-Z0-9])*$/,
      allowNull: true,
    },
  },

  exits: {
    emailAlreadyInUse: {
      responseType: 'conflict',
    },
    usernameAlreadyInUse: {
      responseType: 'conflict',
    },
    activeLimitReached: {
      responseType: 'conflict',
    },
  },

  async fn(inputs) {
    const bcrypt = require('bcrypt');

    // Check if this is the first user (make them admin)
    const userCount = await User.count();
    const isFirstUser = userCount === 0;

    // Public registration - no authentication required
    const values = {
      email: inputs.email.toLowerCase(),
      password: await bcrypt.hash(inputs.password, 10),
      name: inputs.name,
      username: inputs.username ? inputs.username.toLowerCase() : null,
      role: isFirstUser ? User.Roles.ADMIN : User.Roles.BOARD_USER, // First user is admin
      subscribeToOwnCards: false,
      subscribeToCardWhenCommenting: true,
      turnOffRecentCardHighlighting: false,
    };

    let user;
    try {
      user = await User.qm.createOne(values);
    } catch (error) {
      if (error.code === 'E_UNIQUE') {
        throw Errors.EMAIL_ALREADY_IN_USE;
      }

      if (
        error.name === 'AdapterError' &&
        error.raw.constraint === 'user_account_username_unique'
      ) {
        throw Errors.USERNAME_ALREADY_IN_USE;
      }

      if (error.message === 'activeLimitReached') {
        throw Errors.ACTIVE_LIMIT_REACHED;
      }

      throw error;
    }

    // Auto-login after registration
    const accessToken = sails.helpers.utils.createToken(user.id);

    return {
      item: sails.helpers.users.presentOne(user, user),
      included: {
        accessTokens: [
          {
            id: accessToken,
          },
        ],
      },
    };
  },
};
