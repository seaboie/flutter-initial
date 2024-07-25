import readlinePromises from 'readline/promises';
import process from 'process';

const askQuestions = async () => {
    const rl = readlinePromises.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.on("line", (line) => {
      console.log(`🛠️ 🛠️ 🛠️ Received: ${line}`);
    });
  
    try {
      const name = await rl.question("🛠️ 🛠️ 🛠️ What is your name ? " + " " );
      console.log(`Your name is ${name} 😊`);
  
      const age = await rl.question("🛠️ 🛠️ 🛠️ How old are you ? " + " " );
      console.log(`You are ${age} years old. 😊`);
      console.log(`🚀 🚀 🚀 Welcome , ${name} , your old is ${age} years old. ✨ ✨ ✨`);
    } catch (err) {
      console.log(`Oops !!! : 😖 😖 😖 Have error `, err);
    } finally {
      rl.close();
    }
  };

  export { askQuestions };