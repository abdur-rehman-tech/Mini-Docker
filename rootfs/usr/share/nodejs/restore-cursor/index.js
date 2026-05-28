import process from 'node:process';
import once from 'once';
import { onExit } from 'signal-exit';

const restoreCursor = once(() => {
	onExit(() => {
		process.stderr.write('\u001B[?25h');
	}, {alwaysLast: true});
});

export default restoreCursor;
