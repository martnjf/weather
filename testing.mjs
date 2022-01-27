var i = 0;                                  //  set your counter to 1
import { offices } from './offices.mjs';
function insertOffice(index) {
    console.log(index);
}

function myLoop() {                         //  create a loop function
  setTimeout(function() {  
    let response = insertOffice(i);         //  call a 3s setTimeout when the loop is called
    console.log('Running...');              //  your code here
    i++;                                    //  increment the counter
    if (i < offices.length) {                           //  if the counter < 10, call the loop function
      myLoop();                             //  ..  again which will trigger another 
    }                                       //  ..  setTimeout()
  }, 1000)
}

myLoop();    

//  https://www.codegrepper.com/code-examples/javascript/execute+for+loop+multiple+times+with+delay+in+between+javascript

/*
  function functionLooper() {
      for (let i = 0; i < 5; i++) {
          let response = insertOffice(i);
      }
  }

  functionLooper();
*/
