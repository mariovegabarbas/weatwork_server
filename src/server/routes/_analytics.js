const queries = require('../db/queries/responses');

function stressEnergyAnalytics(id) {
  return new Promise((resolve, reject) => {
    queries.getLastStress(id)
    .then((question) => {
        if(question[0]){
          stressRes = 0;
          energyRes = 0;
          aux = 0;
          comment = 'No stress';
          data = question[0].responses.split('#');
          for(var i = 0, len = data.length; i < len; i++){
            if(i<6){
              if(i<3) stressRes = stressRes + parseInt(data[i]);
              else {
                switch(data[i]){
                  case '0': aux = 5; break;
                  case '1': aux = 4; break;
                  case '2': aux = 3; break;
                  case '3': aux = 2; break;
                  case '4': aux = 1; break;
                  case '5': aux = 0; break;
                  default: break;
                }
                stressRes = stressRes + aux;
                console.log(stressRes);
              }
            }else{
              if(i<9) energyRes = energyRes + parseInt(data[i]);
              else {
                switch(data[i]){
                  case '0': aux = 5; break;
                  case '1': aux = 4; break;
                  case '2': aux = 3; break;
                  case '3': aux = 2; break;
                  case '4': aux = 1; break;
                  case '5': aux = 0; break;
                  default: break;
                }
                energyRes = energyRes + aux;
                //console.log(energyRes);
              } 
            }
          }

          if(stressRes/6 > 2.4){
            //console.log(stressRes/6);
            comment = 'Some stress, take care today!';
          }
          if(energyRes/6 > 2.7){
            //console.log(energyRes/6);
            comment = 'Some energy, take care today!';
          }

          if(stressRes/6 <= 2.4 && energyRes/6 <= 2.6) comment = "You look bored! Time for a coffee or even afterwork with your colleages?"; //Bored
          if(stressRes/6 > 2.4 && energyRes/6 <= 2.6) comment = "You Look Exhausted!  Leave space in your schedule for rest and stop rushing"; //Worn out
          if(stressRes/6 <= 2.4 && energyRes/6 > 2.6) comment = "You kook very energic, save your energy for possible stressfull days."; //Commited without pressure
          if(stressRes/6 > 2.4 && energyRes/6 > 2.6) comment = "Well done! You look energic even under pressure. Leave space in your schedule for rest to keep your energy."; //Commited with pressure

          resolve("Evaluation of previous days: "+comment);
        }
    })
    .catch((err) => { reject(false); });
  });
}

module.exports = {
  stressEnergyAnalytics
};
