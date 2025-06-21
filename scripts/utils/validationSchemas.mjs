export const createUserValidationSchema = {
    username: {
        notEmpty: {
            errorMessage: 'username must be provided'
        },
        isLength: {
            options: {
                min: 3,
                max: 25
            },

            errorMessage: 'Characters must be between 3 to 25'
        }
    },
    email: {
         notEmpty: {
            errorMessage: 'email must be provided'
        },
        isLength: {
            options: {
                min: 3,
                max: 25
            },

            errorMessage: 'Characters must be between 3 to 25'
        }
    },
    password: {
         notEmpty: {
            errorMessage: 'password must be provided'
        },
        isLength: {
            options: {
                min: 3,
                max: 25
            },

            errorMessage: 'Characters must be between 3 to 25'
        }
    }
};

export const createCryptoValidationSchema = {
    user: {
        notEmpty: {
            errorMessage: 'a user must be provided'
        },
        isLength: {
            options: {
                min: 3,
                max: 25
            },

            errorMessage: 'Characters must be between 3 to 25'
        }
    },
    price: {
         notEmpty: {
            errorMessage: 'price must be provided'
        },
        isLength: {
            options: {
                min: 3,
                max: 25
            },

            errorMessage: 'Characters must be between 3 to 25'
        }
    },
    quantity: {
        notEmpty: {
            errorMessage: 'quantity must be provided'
        }
    },
    limits: {
        notEmpty: {
            errorMessage: 'limit must be provided'
        }
    }
};

