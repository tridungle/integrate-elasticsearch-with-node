# node-es6-boilerplate
# Scripts

**"build:babel"**: build the source code with babel

**"start:babel"**: start project with babel

**"serve"**: start project with pm2

**"build"**: build project with webpack

**"restart"**: restart pm2 project

**"stop"**: stop pm2 project

**"start"**: start project with webpack

# Config alias

**Babel**

        "plugins": [
            [
                "babel-plugin-module-resolver",
                {
                    "alias": {
                        "@app": "./src/app",
                        "@config": "./src/config",
                        "@database": "./src/database",
                        "@helpers": "./src/helpers",
                        "@middlewares": "./src/middlewares",
                        "@routes": "./src/routes"
                    }
                }
            ]
        ]

**Webpack**

Without any additional plugins, Webpack allows aliasing module imports through the resolve.alias property in your config.

    module.resolve = {
        alias: {
            "@app": "./src/app",
            "@config": "./src/config",
            "@database": "./src/database",
            "@helpers": "./src/helpers",
            "@middlewares": "./src/middlewares",
            "@routes": "./src/routes"
        }
    }


**VS Code**

Making VS Code ‘smarter’ by telling it how to resolve these aliases is as easy as adding a jsconfig.json file to your project at the root. Use the exclude property to keep VS Code from slowing down by searching node_modules or compiled folders (like dist).

    {
        "compilerOptions": {
            "target": "es2017",
            "allowSyntheticDefaultImports": false,
            "baseUrl": "./",
            "paths": {
                "@app": "./src/app",
                "@config": "./src/config",
                "@database": "./src/database",
                "@helpers": "./src/helpers",
                "@middlewares": "./src/middlewares",
                "@routes": "./src/routes"
            }
        },
        "exclude": ["node_modules", "dist"]
    }