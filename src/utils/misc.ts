import fs from 'fs';
import path from 'path';
import {getInput} from '@actions/core' ;
import {Context} from '@actions/github/lib/context';
import {DEFAULT_COMMIT_MESSAGE, DEFAULT_TARGET_PATHS, TARGET_EVENTS} from '../constant';

export const isTargetEvent = (context: Context): boolean => isTargetRef(context) && 'string' === typeof context.payload.action && context.eventName in TARGET_EVENTS && (TARGET_EVENTS[context.eventName] === context.payload.action || '*' === TARGET_EVENTS[context.eventName]);

export const getBuildVersion = (filepath: string): string | boolean => {
    if (!fs.existsSync(filepath)) {
        return false;
    }

    const json = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    if (json && 'tagName' in json) {
        return json['tagName'];
    }

    return false;
};

const getTargetPaths = (): string[] => [...new Set<string>((getInput('TARGET_PATHS') || DEFAULT_TARGET_PATHS).split(',').map(target => target.trim()).filter(target => target && !target.startsWith('/') && !target.includes('..')))];

export const getDocTocArgs = () => getTargetPaths().join(' ');

const getWorkspace = (): string => process.env.GITHUB_WORKSPACE || '';

export const getWorkDir = () => path.resolve(getWorkspace(), '.work');

export const getGitUrl = (context: Context): string => `https://github.com/${context.repo.owner}/${context.repo.repo}.git`;

export const getRef = (context: Context): string => context.ref;

const isTargetRef = (context: Context): boolean => /^refs\/heads\//.test(getRef(context));

export const getBranch = (context: Context): string => getRef(context).replace(/^refs\/heads\//, '');

export const getCommitMessage = (): string => getInput('COMMIT_MESSAGE') || DEFAULT_COMMIT_MESSAGE;