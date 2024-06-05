import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TEST_DNA_PATH = {
	path: path.join(__dirname, '../../hc-zomes.dna'),
};

export const JC_DNA_PATH = {
	path: path.join(__dirname, '../../dnas/joining-code-factory.dna'),
}
