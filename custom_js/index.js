import { initializeExperiment } from '../../../templates/js/index';

// Some constants
const questions = [{expType: "auto_preload"}]; // Start with auto-preload
const stimuli_duration = 2400;
// const task_duration = 5000;
const keyboard_choices = ['f', 'j'];
const speed_px_per_sec = 1.718 // calculate from BOLDscreen, 0.15cm physical distance
// const fixation_duration = 1000;
const instruction_duration = 2000;
const ISI = 600;

document.body.style.backgroundColor = "white";
document.body.style.overflow = "hidden";
document.body.style.color = "black";
document.body.style.fontFamily = "Arial, sans-serif";

// const order_codes = [
//   [1,2,3,4,5,6,7,8],   // Sequential order
//   [8,7,6,5,4,3,2,1],   // Reverse order
//   [3,4,1,2,7,8,5,6],   // Arbitrary order ensuring balance
//   [6,5,8,7,2,1,4,3],   // Another balanced sequence
//   [2,3,4,1,6,7,8,5],   // Shifted sequence
//   [5,8,7,6,1,4,3,2]    // Another variation
// ];

// const stim_orders = [
//   ['action', 'objevents', 'stillobj'], 
//   ['stillobj', 'objevents', 'action'],
//   ['action','stillobj','objevents'],
//   ['objevents','action','stillobj'],
//   ['stillobj','action','objevents'],
//   ['objevents','stillobj','action']
// ];

const order_codes = [
  [2, 5, 6, 3, 1, 4],
  [3, 6, 4, 1, 2, 5],
  [1, 4, 3, 6, 5, 2],
  [6, 3, 5, 2, 4, 1],
  [4, 1, 2, 5, 6, 3],
  [5, 2, 1, 4, 3, 6]
];



// const stim_orders = [
//   ['action','stillobj'],
//   ['stillobj','action'],
  
// ];

//const stimulus_type=['action','stillobj'];
// const stim=[stimulus_type[Math.random() < 0.5? 0:1]]; // random choose a stimulus type

// const stim=[].concat(stim_orders[run_orders[0]],stim_orders[run_orders[1]],stim_orders[run_orders[2]]); // if run_order = [1, 2, 2], stim = action, stillobj, stillobj, action, stillobj, action

// for 2 categories
// const stim = Math.random() < 0.5 
//   ? ['action', 'stillobj'] 
//   : ['stillobj', 'action'];

// only 1 category
const stim = ['action']


const ntrial=1; // 6 for experiment 
console.log("Run orders:", stim);

//const cb = [1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 1, 2, 1, 5, 6, 3, 4]; 

// for debug
const cb = [1, 2, 3, 4, 5, 6]; 
// we use this to index order_codes this need to keep the 1, 2; 3, 4; and 5, 6 combination to keep the task switch low

async function fetchData() {
  try {

  // Fetch for test materials list
  console.log("Current directory (__dirname):", __dirname);
  console.log("fetching data...")

  const countResponse = await fetch(`/get-idx`, { method: 'POST' });
    if (!countResponse.ok) throw new Error('Failed to fetch list_idx');
    const countData = await countResponse.json();
    let list = countData.idx;
    // check if list == 'done', return a page saying the participant has completed the task
    if (list === 'done') {
      document.body.innerHTML = `
        <div style="font-size:28px; text-align:center; display: flex; justify-content: center; align-items: center; height: 100vh; margin: auto; max-width: 800px;">  
          <div> 
            <strong>Thank you for participating in our study!</strong><br>
            <p>You have already completed the study.</p>
          </div>
        </div>
      `;
      return;
    }
    console.log('Using list:', list, '| typeof: ', typeof list);

    // Fetch for test materials list
    const testMaterialsResponse = await fetch('/MultiSemantics_stimuli/stimulus_final_select_0505_updated_set1.json');
    if (!testMaterialsResponse.ok) throw new Error('Failed to fetch test materials list');
    const alldata = await testMaterialsResponse.json();
    console.log("Test materials data received:", alldata);
    

    // Filter data based on the list
    const filteredData = alldata.filter(item => {
      if (Array.isArray(item.sublist)) {
        return item.sublist.includes(list);
      } else {
        return item.sublist === list;
      }
    });

    console.log("Filtered data list:", filteredData.map(item => item.sublist));

  // INITIAL INSTRUCTIONS - using predefined images
  questions.push({
    prompt: `
      <div style="min-height: 50vh; display: flex; justify-content: center; align-items: center; overflow: hidden;">
        <div style="font-size: 25px; text-align: left; width: 90%; max-width: 900px;">
              <div style="font-size: 40px; font-weight: bold; text-align: center; margin-bottom: 20px;">
              Instructions
              </div>
              <ul>
                  <li>In this study, you will be seeing a series of pictures or sentences, and they will be moving on the screen. </li>
                  <li>There are three types of tasks. </li>                
              </ul>
              Press <strong>ENTER</strong> to for further instruction.
          </div>
      </div>
    `,
    expType: 'keyresponse',
    choices: ['Enter']
  });

  questions.push({
    prompt: `
      <div style="min-height: 50vh; display: flex; justify-content: center; align-items: center; overflow: hidden;">
        <div style="font-size: 25px; text-align: left; width: 90%; max-width: 900px;">
              <ul>
                  <li>   In <strong>[100 years ago?]</strong> task, you will provide a Yes/No answer to this question: Could a scene like this be seen 100 years ago? <br>
                         You will answer this question for either <strong>object</strong> or <strong>action</strong> depicted in the stimulus.<br>
                         If <strong>YES</strong>, press <strong>[F]</strong>, <strong>NO</strong>, press <strong>[J]</strong>.<br>
                         <br> <!-- This adds an empty line --> 
                         You <strong>do not</strong> need to think too hard about this, just go with your intuition and experience. </li>
              </ul>
              Press <strong>ENTER</strong> to for further instruction.
          </div>
      </div>
    `,
    expType: 'keyresponse',
    choices: ['Enter']
  });  

  questions.push({
    prompt: `
      <div style="min-height: 50vh; display: flex; justify-content: center; align-items: center; overflow: hidden;">
        <div style="font-size: 25px; text-align: left; width: 90%; max-width: 900px;">
              <ul>
                  <li>   In <strong>[Left/Right?]</strong> task, you will indicate the moving direction of the stimulus.<br>
                         If the stimulus moves to the <strong>Left</strong>, press <strong>[F]</strong> <br>
                         If the stimulus moves to the <strong>Right</strong>, press <strong>[J]</strong>       
                  </li>

              </ul>
              Press <strong>ENTER</strong> to for further instruction.
          </div>
      </div>
    `,
    expType: 'keyresponse',
    choices: ['Enter']
  });  

  questions.push({
    prompt: `
      <div style="min-height: 50vh; display: flex; justify-content: center; align-items: center; overflow: hidden;">
        <div style="font-size: 25px; text-align: left; width: 90%; max-width: 900px;">
              <ul>
                  <li>   In the <strong>viewing</strong> task, press <strong>[F]</strong> after viewing the stimulus.<br>                 
                  </li>

              </ul>
              Press <strong>ENTER</strong> to for further instruction.
          </div>
      </div>
    `,
    expType: 'keyresponse',
    choices: ['Enter']
  }); 

  questions.push({
    prompt: `
      <div style="font-size:25px; text-align:left; display: flex; justify-content: center; align-items: center; min-height: 50vh; margin: auto; max-width: 800px; overflow: hidden;">
          <div>
              <ul>
                  <li>There will be 6 sessions, each session has 6 mini blocks. </li>
                  <li>At the begining of each block, you will see the prompt indicating which task you will be completing in this block.</li> 
              </ul>
              Press <strong>ENTER</strong> to begin.
          </div>
      </div>
    `,
    expType: 'keyresponse',
    choices: ['Enter']
  });

  // questions.push({
  //   prompt:" ",
  //   image: `/MultiSemantics_stimuli/stimuli_examples2.png`,
  //   expType: 'imagedisplay',
  //   choices: ['Enter'],
  // });

  let sess = 1;
  stim.forEach((stimulus, index) => {
    console.log("Current stimulus type is:", stimulus);

    // Ensure alldata is an array before filtering
    if (!Array.isArray(alldata)) {
        throw new Error("alldata is not an array. Check the fetched JSON structure.");
    }

    let data = filteredData.filter(item => item.stimulus_type.includes(stimulus));
    if (data.length === 0) throw new Error('No matching data found for the stimulus');

    const randomNumber = Math.floor(Math.random() * 6) + 1;
    //const randomNumber = 1; // choose base order for the block, this is different for each run session
    const order=order_codes[randomNumber];
    // const repeated_order = [].concat(order, order, order); # concatenate 3 times for 3 blocks
    const repeated_order = order; // for debug
    const blocks=cb.map(i => repeated_order[i-1]); // blocks stores block indices for the run

    console.log('block series:', blocks);
    console.log('Data for the current run',data);

    let block_data = [];
    // let sess = 1;
    blocks.forEach((block,ib) => {
      
      

      // start each run (6 runs in total)
      if (ib === 0 || ib === 6 || ib === 12) {
      questions.push({
      prompt: `You are about to begin session ${sess}. Please be ready! <br>
      <br> <!-- This adds an empty line --> 
      <br> Press [F] or [J] to start!`,
      expType: 'keyresponse',
      choices: keyboard_choices
      })
      sess += 1;
      }

      block = Number(block); 
      console.log("Current block is", block);

      let filteredData = [];
      if (block === 1) {
        filteredData = data.filter(item => item.modality === 'pic' && item.Task === 'SemTask');

        questions.push({
          prompt:`<span style="color: red;">Could a scene like this be seen 100 years ago</span>?
          <br><br> <!-- This adds an empty line -->
          <span style="margin-left: 20px;color: red;">F-Yes</span> 
          <span style="margin-left: 20px;color: red;">J-No</span>`,
          expType: 'textdisplay',
          duration: instruction_duration
        });
        

      } else if (block === 2) {
        filteredData = data.filter(item => item.modality === 'pic' && item.Task === 'Perc');

        questions.push({
          prompt:`<span style="color: red;">Left/Right?</span>
          <br><br> <!-- This adds an empty line -->
          <span style="margin-left: 20px;color: red;">F-Yes</span> 
          <span style="margin-left: 20px;color: red;">J-No</span>`,
          expType: 'textdisplay',
          duration: instruction_duration
        });

      } else if (block === 3) {
        filteredData = data.filter(item => item.modality === 'pic' && item.Task === 'NoTask');
        
        questions.push({
          prompt:`<span style="color: red;">After viewing the stimulus, press F</span>`,
          expType: 'textdisplay',
          duration: instruction_duration
        });

      } else if (block === 4) {
        filteredData = data.filter(item => item.modality === 'sent' && item.Task === 'SemTask');
        
        questions.push({
          prompt:`<span style="color: red;">Could a scene like this be seen 100 years ago?</span>
          <br><br> <!-- This adds an empty line -->
          <span style="margin-left: 20px;color: red;">F-Yes</span> 
          <span style="margin-left: 20px;color: red;">J-No</span>`,
          expType: 'textdisplay',
          duration: instruction_duration
        });

      } else if (block === 5) {
        filteredData = data.filter(item => item.modality === 'sent' && item.Task === 'Perc');
        
        questions.push({
          prompt:`<span style="color: red">Left/Right?</span>
          <br><br> <!-- This adds an empty line -->
          <span style="margin-left: 20px;color: red;">F-Yes</span> 
          <span style="margin-left: 20px;color: red;">J-No</span>`,
          expType: 'textdisplay',
          duration: instruction_duration
        });
        
      } else if (block === 6) {
        filteredData = data.filter(item => item.modality === 'sent' && item.Task === 'NoTask');
        
        questions.push({
          prompt:`<span style="color: red;">After viewing the stimulus, press F</span>`,
          expType: 'textdisplay',
          duration: instruction_duration
        });

      }

      
      if (filteredData.length === 0) throw new Error('No matching data found for block');
      let shuffledData = filteredData.sort(() => Math.random() - 0.5);
      block_data = shuffledData.slice(0, ntrial);
      console.log("Selected Block Data:", block_data);
      data = data.filter(item => !block_data.includes(item));


      // let n_change = Array(ntrial).fill(0);
      let direction = Array(ntrial).fill(0);

      let helpText = '';

      if (block === 1 || block === 4) {
        helpText = "100 years ago?";
      } else if (block === 2 || block === 5) {
        helpText = "left or right?";
      } else if (block === 3 || block === 6) {
        helpText = "Press F after viewing";
      }

      questions.push({
        expType: 'showHelpText',
        helpText: helpText
      });

      block_data.forEach((item, trial_idx) => {

         console.log(`block: ${ib}; trial: ${trial_idx}`);
        // console.log("Extracted modifiedSentences_updated:", item.modifiedSentences_updated);

        // let new_n_change = Math.random() > 0.5 ? 3 : 4;

        // if (trial_idx >= 2) {
        //   while (n_change[trial_idx - 2] === new_n_change && n_change[trial_idx - 1] === new_n_change) {
        //       new_n_change = Math.random() > 0.5 ? 3 : 4;
        //   }
        // }

        // n_change[trial_idx] = new_n_change;

        let new_direction = Math.random() < 0.5 ? 1 : 0;

        if (trial_idx >= 2) {
          while (direction[trial_idx - 2] === new_direction && direction[trial_idx - 1] === new_direction) {
              new_direction = Math.random() < 0.5 ? 1 : 0;
          }
        }        

        direction[trial_idx] = new_direction;

        if (item.modality === 'pic') {
          questions.push({
            expType: 'movingStimulus_LR',         
            stimulus: `/MultiSemantics_images/${item.stimulus}.jpg`,
            choices: keyboard_choices,
            duration: stimuli_duration, 
            speed: speed_px_per_sec,
            directictionIdx: new_direction,
            data: { 
              list: item.sublist,
              block_idx:block,
              question: item.stimulus,
              modality: item.modality,
              type: item.stimulus_type,
              correctanswer: item.trial_type
            } 
          });
        } else {
          questions.push({
            expType: 'movingStimulus_LR',
            stimulus: `<span style="color: black;">${item.stimulus}</span>`,
            choices: keyboard_choices,
            duration: stimuli_duration, 
            speed: speed_px_per_sec,
            directictionIdx: new_direction,
            data: { 
              list: item.sublist,
              block_idx:block,
              question: item.stimulus,
              modality: item.modality,
              type: item.stimulus_type,
              correctanswer: item.trial_type
            } 
          });        
        }

        questions.push({
          prompt: "+",
          expType: 'textdisplay',
          duration: ISI
        });
        
      });

      questions.push({
        expType: 'hideHelpText'
      });

    })


  })


      // Initialize experiment with generated questions
      console.log("Questions generated:", questions);
      initializeExperiment(questions, 'MultiSemantics');

    } catch (error) {
      console.error('Error during fetch or processing:', error);
    }
  }

// Call the fetchData function to kick off the process
fetchData();