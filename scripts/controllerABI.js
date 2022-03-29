const ControllerABI = [
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_addresses",
          "type": "address[]"
        },
        {
          "internalType": "uint256",
          "name": "_feePoints",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_feeBasePoints",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_maxFeePercent",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "_tokens",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_minimumDeposits",
          "type": "uint256[]"
        },
        {
          "internalType": "uint8[]",
          "name": "_decimals",
          "type": "uint8[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "aaveMarketTokens",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        }
      ],
      "name": "activateVault",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_amTokens",
          "type": "address[]"
        }
      ],
      "name": "addAaveMarketTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_tokens",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_minimumDeposits",
          "type": "uint256[]"
        },
        {
          "internalType": "uint8[]",
          "name": "_decimals",
          "type": "uint8[]"
        }
      ],
      "name": "addTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "addUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_users",
          "type": "address[]"
        }
      ],
      "name": "addUsers",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_vault",
          "type": "address"
        }
      ],
      "name": "addVault",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "checkUserStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "controller",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "_tokens",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_amounts",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_times",
          "type": "uint256[]"
        }
      ],
      "name": "createTrade",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        }
      ],
      "name": "deactivateVault",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "feeAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "feeBasePoints",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "feePoints",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_orderId",
          "type": "uint256"
        }
      ],
      "name": "fillOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllUsers",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getUserId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_startId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_endId",
          "type": "uint256"
        }
      ],
      "name": "getUsersRange",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "lendingPool",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxFeePercent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        }
      ],
      "name": "openOrdersLength",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        }
      ],
      "name": "ordersLength",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_amToken",
          "type": "address"
        }
      ],
      "name": "removeAaveMarketToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "removeAllUsersExceptOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        }
      ],
      "name": "removeToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "removeUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_users",
          "type": "address[]"
        }
      ],
      "name": "removeUsers",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rewards",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_controller",
          "type": "address"
        }
      ],
      "name": "setController",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_feePoints",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_feeBasePoints",
          "type": "uint256"
        }
      ],
      "name": "setFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_feeAddress",
          "type": "address"
        }
      ],
      "name": "setFeeAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_lendingPool",
          "type": "address"
        }
      ],
      "name": "setLendingPool",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_minimumDeposit",
          "type": "uint256"
        }
      ],
      "name": "setMinimumDeposit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_rewards",
          "type": "address"
        }
      ],
      "name": "setRewards",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_settings",
          "type": "address"
        }
      ],
      "name": "setSettings",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "settings",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        }
      ],
      "name": "tokenLength",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenTradeLength",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "usersLength",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "vaults",
      "outputs": [
        {
          "internalType": "contract IVaultBase",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "viewOpenOrders",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "tradeId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "orderId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "buyOrder",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            },
            {
              "internalType": "address[2]",
              "name": "tokens",
              "type": "address[2]"
            },
            {
              "internalType": "uint256[2]",
              "name": "amounts",
              "type": "uint256[2]"
            },
            {
              "internalType": "uint256[1]",
              "name": "times",
              "type": "uint256[1]"
            }
          ],
          "internalType": "struct IVaultBase.Order[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_start",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_end",
          "type": "uint256"
        }
      ],
      "name": "viewOpenOrdersInRange",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "tradeId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "orderId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "buyOrder",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            },
            {
              "internalType": "address[2]",
              "name": "tokens",
              "type": "address[2]"
            },
            {
              "internalType": "uint256[2]",
              "name": "amounts",
              "type": "uint256[2]"
            },
            {
              "internalType": "uint256[1]",
              "name": "times",
              "type": "uint256[1]"
            }
          ],
          "internalType": "struct IVaultBase.Order[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_orderId",
          "type": "uint256"
        }
      ],
      "name": "viewOrder",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "tradeId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "orderId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "buyOrder",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            },
            {
              "internalType": "address[2]",
              "name": "tokens",
              "type": "address[2]"
            },
            {
              "internalType": "uint256[2]",
              "name": "amounts",
              "type": "uint256[2]"
            },
            {
              "internalType": "uint256[1]",
              "name": "times",
              "type": "uint256[1]"
            }
          ],
          "internalType": "struct IVaultBase.Order",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "_orderIds",
          "type": "uint256[]"
        }
      ],
      "name": "viewOrders",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "tradeId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "orderId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "buyOrder",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            },
            {
              "internalType": "address[2]",
              "name": "tokens",
              "type": "address[2]"
            },
            {
              "internalType": "uint256[2]",
              "name": "amounts",
              "type": "uint256[2]"
            },
            {
              "internalType": "uint256[1]",
              "name": "times",
              "type": "uint256[1]"
            }
          ],
          "internalType": "struct IVaultBase.Order[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "viewStrategy",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address[2]",
              "name": "tokens",
              "type": "address[2]"
            },
            {
              "internalType": "uint256[]",
              "name": "amounts",
              "type": "uint256[]"
            },
            {
              "internalType": "uint256[1]",
              "name": "times",
              "type": "uint256[1]"
            }
          ],
          "internalType": "struct IVaultBase.Strategy",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        }
      ],
      "name": "viewToken",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "viewTokenAmounts",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "internalType": "struct IVaultBase.Token[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_tradeId",
          "type": "uint256"
        }
      ],
      "name": "viewTrade",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "tradeId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "orderId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "buyOrder",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            },
            {
              "internalType": "address[2]",
              "name": "tokens",
              "type": "address[2]"
            },
            {
              "internalType": "uint256[2]",
              "name": "amounts",
              "type": "uint256[2]"
            },
            {
              "internalType": "uint256[1]",
              "name": "times",
              "type": "uint256[1]"
            }
          ],
          "internalType": "struct IVaultBase.Order[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "_tradeIds",
          "type": "uint256[]"
        }
      ],
      "name": "viewTrades",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "tradeId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "orderId",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "buyOrder",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            },
            {
              "internalType": "address[2]",
              "name": "tokens",
              "type": "address[2]"
            },
            {
              "internalType": "uint256[2]",
              "name": "amounts",
              "type": "uint256[2]"
            },
            {
              "internalType": "uint256[1]",
              "name": "times",
              "type": "uint256[1]"
            }
          ],
          "internalType": "struct IVaultBase.Order[][]",
          "name": "",
          "type": "tuple[][]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        }
      ],
      "name": "viewVault",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_vaultId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "withdrawETH",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        }
      ],
      "name": "withdrawToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_tokens",
          "type": "address[]"
        }
      ],
      "name": "withdrawTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]

  module.exports = {
    ControllerABI
}