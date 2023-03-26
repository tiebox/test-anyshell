#!/usr/bin/env node
import React, { useState } from 'react';
import chalk from 'chalk';
import SelectInput from 'ink-select-input';
import { Text } from 'ink';
import shell from 'shelljs';
import figures from 'figures';
import { useBeforeRender } from './hooks/useBeforeRender.js';
import { useCommandList } from './hooks/useCommands.js';
const commandExecutor = ({ shellCommand, async, silent, setup }, cb) => {
    const shellProcess = shell.exec(shellCommand, { async, silent });
    if (setup) {
        if (setup === 'docker_compose') {
            const childShellProcess = shellProcess;
            childShellProcess.on('exit', (code, signal) => {
                if (code)
                    cb({ dockerComposeExitCode: code });
            });
        }
    }
};
export const App = () => {
    useBeforeRender(() => {
        shell.exec('clear');
    }, []);
    const [a, b] = useState('');
    const { parsedYaml, isError, isLoading } = useCommandList();
    return (React.createElement(React.Fragment, null,
        React.createElement(Text, null,
            chalk.hex('#ff0055').italic.bgWhiteBright(' cliper '),
            " \u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0434\u043B\u044F \u0437\u0430\u043F\u0443\u0441\u043A\u0430 \u0441\u043A\u0440\u0438\u043F\u0442\u043E\u0432"),
        React.createElement(Text, null, " "),
        React.createElement(Text, null,
            chalk.bgBlue(' INFO '),
            " \u0421\u0442\u0440\u0435\u043B\u043A\u0430\u043C\u0438 \u0432\u0432\u0435\u0440\u0445 \u0438 \u0432\u043D\u0438\u0437 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0434\u043B\u044F \u0437\u0430\u043F\u0443\u0441\u043A\u0430"),
        isLoading ? (React.createElement(Text, null,
            "\u0427\u0442\u0435\u043D\u0438\u0435 \u043A\u043E\u043D\u0444\u0438\u0433\u0430:",
            ' ',
            chalk.hex('#ff0055').italic.bgWhiteBright(' .anyshell.yaml '))) : isError ? (React.createElement(Text, null,
            "\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u043A\u043E\u043D\u0444\u0438\u0433-\u0444\u0430\u0439\u043B:",
            ' ',
            chalk.hex('#ff0055').italic.bgWhiteBright(' .anyshell.yaml '))) : (React.createElement(SelectInput, { onSelect: (item) => commandExecutor(item.value, (cbProps) => {
                b(cbProps.dockerComposeExitCode.toString());
            }), items: Object.keys(parsedYaml.commandList).map((commandName) => ({
                label: commandName,
                key: commandName,
                value: parsedYaml.commandList[commandName],
            })), indicatorComponent: ({ isSelected }) => isSelected ? (React.createElement(Text, { color: "#ffff86" },
                a === 'done' ? 'done' : null,
                " ",
                figures.pointer)) : null, itemComponent: ({ isSelected, label }) => isSelected ? (React.createElement(Text, { color: "#ff5eea" },
                " ",
                label)) : (React.createElement(Text, { color: "#aaeef3" },
                ' ' + ' ',
                label)), initialIndex: 2 }))));
};
