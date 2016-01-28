export default function setupEnv(port, config) {
    process.argv = process.argv.slice(0, 2);
    process.argv = [...process.argv, '-l', port, '-c', config];
}
