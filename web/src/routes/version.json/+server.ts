import { json }        from '@sveltejs/kit';
import { readFile }    from 'node:fs/promises';
import { join, parse } from 'node:path';
import { existsSync }  from 'node:fs';
import { cwd }         from 'node:process';

const findFile = (file: string) => {
    let dir = cwd();

    while (dir !== parse(dir).root) {
        if (existsSync(join(dir, file))) {
            return dir;
        }

        dir = join(dir, '../');
    }
}

const root = findFile('.git');
const pack = findFile('package.json');
if (!root) {
    throw 'no git repository root found';
} else if (!pack) {
    throw 'no package root found';
}

const readGit = (filename: string) => readFile(join(root, filename), 'utf8');

const getCommit = async () => {
    return (await readGit('.git/logs/HEAD'))
            ?.split('\n')
            ?.filter(String)
            ?.pop()
            ?.split(' ')[1];
}

const getBranch = async () => {
    if (process.env.CF_PAGES_BRANCH) {
        return process.env.CF_PAGES_BRANCH;
    }

    return (await readGit('.git/HEAD'))
            ?.replace(/^ref: refs\/heads\//, '')
            ?.trim();
}

const getRemote = async () => {
    let remote = (await readGit('.git/config'))
                    ?.split('\n')
                    ?.find(line => line.includes('url = '))
                    ?.split('url = ')[1];

    if (remote?.startsWith('git@')) {
        remote = remote.split(':')[1];
    } else if (remote?.startsWith('http')) {
        remote = new URL(remote).pathname.substring(1);
    }

    remote = remote?.replace(/\.git$/, '');

    if (!remote) {
        throw 'could not parse remote';
    }

    return remote;
}

const getVersion = async () => {
    const { version } = JSON.parse(
        await readFile(join(pack, 'package.json'), 'utf8')
    );

    return version;
}

export async function GET() {
    return json({
        commit: await getCommit(),
        branch: await getBranch(),
        remote: await getRemote(),
        version: await getVersion()
    });
}

export const prerender = true;