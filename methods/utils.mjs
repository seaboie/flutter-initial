import process from 'process';

const getProjectName = async (index) => {
    const currentPath = process.cwd();
    const splitCurrentPaths = currentPath.split('/');
    const projectName = await splitCurrentPaths[splitCurrentPaths.length - index];
    console.log(`🎉 Your project is ${projectName}`);
    return projectName
}

export { getProjectName }