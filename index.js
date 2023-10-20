const core = require("@actions/core");
const compose = require("docker-compose");
const fs = require("fs");
const yaml = require("js-yaml");

const myArgs = process.argv.slice(2);

const composeFile = `${__dirname}/services/docker-compose.yml`;
const execFile = `${__dirname}/services/exec.yml`;

async function up() {
    try {
        await compose.upAll({ config: composeFile, log: false })
            .then(
                    () => { core.info("compose started"); },
                    (err) => { core.setFailed(`compose up failed ${err}`); }
                    );
    } catch (error) {
        core.setFailed(error.message);
    }
}

async function down() {
    try {
        await compose.down({ config: composeFile, log: false })
            .then(
                    () => { core.info("compose down"); },
                    (err) => { core.setFailed(`compose down failed ${err}`); }
                    );
    } catch (error) {
        core.setFailed(error.message);
    }
}

async function execInContainer(container, commands, options={}) {
    for(const c of commands)
    {
        try {
            await compose.exec(container, c, options);
        } catch (error) {
            core.setFailed(error.err);
        }
    }
}

async function init() {

    if (!fs.existsSync(execFile)) {
        core.info("exec.yml not found");
    } else {
        let containerCommands = yaml.load(fs.readFileSync(execFile, "utf8"));

        for(const cc of containerCommands["exec_list"]) {
            try {
                core.info(`executing "${cc.name}" inside "${cc.container}"`);
                execInContainer(cc.container, cc.commands, { config: composeFile, log: false });
            } catch (error) {
                core.setFailed(error.message);
            }
        }
    }
}

try {
    fs.existsSync(composeFile);
} catch (error) {
    core.setFailed(error.message);
}

process.env.PHPIPAM_VERSION = core.getInput("phpipam_version");
process.env.PHPIPAM_DATABASE_HOST = core.getInput("phpipam_database_host");
process.env.PHPIPAM_DATABASE_USER = core.getInput("phpipam_database_user");
process.env.PHPIPAM_DATABASE_PASS = core.getInput("phpipam_database_pass");
process.env.PHPIPAM_DATABASE_NAME = core.getInput("phpipam_database_name");
process.env.MYSQL_ROOT_PASSWORD = core.getInput("database_root_password");

switch (myArgs[0]) {
    case "up":
        up();
        break;
    case "init":
        init();
        break;
    case "down":
        down();
        break;
    default:
        core.info(`staring phpipam (${process.env.PHPIPAM_VERSION}) in action mode`);
        up();
        setTimeout(init, 30000);
}
