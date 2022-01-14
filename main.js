const core = require('@actions/core');
const compose = require('docker-compose');
const fs = require('fs');
const yaml = require('js-yaml');

const myArgs = process.argv.slice(2);

const composeFile = './services/docker-compose.yml';
const services_exec = './services/exec.yml';

async function up() {
    try {
        await compose.upAll({ config: composeFile, log: false })
            .then(
                    () => { console.log('compose started')},
                    err => { core.setFailed(`compose up failed ${err}`)}
                    );
    } catch (error) {
        core.setFailed(error.message);
    }
}

function down() {
    try {
        compose.down({ config: composeFile, log: false })
            .then(
                    () => { console.log('compose down')},
                    err => { core.setFailed(`compose down failed ${err}`)}
                    );
    } catch (error) {
        core.setFailed(error.message);
    }
}

async function init() {

    if (!fs.existsSync(services_exec)) {
        console.log('exec.yml not found');
    } else {
        let container_commands = yaml.load(fs.readFileSync(services_exec, 'utf8'));

        for(const cc of container_commands['exec_list']) {
            try {
                console.log(`executing "${cc.name}" inside "${cc.container}"`);
                for(const c of cc['commands'])
                {
                    await compose.exec(cc.container, c, { config: composeFile, log: true })
                }
            } catch (error) {
                core.setFailed(error.message);
            }
        }
    }
}

if (!fs.existsSync(composeFile)) {
    console.log(`${composeFile} not exists`);
    return
}

switch (myArgs[0]) {
    case 'up': {
        up();
        break;
    }
    case 'init': {
        init();
        break;
    }
    case 'down': {
        down();
        break;
    }
    default: {
        console.log('staring phpipam in action mode')
        up();
        setTimeout(init, 30000);
    }
}
