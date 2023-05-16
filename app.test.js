function testMe(parameters) {
  const { State, Type, Sort } = parameters;
  //////////////////////////////
  if(!State && !Type && !Sort) {
    return 0;
  }
  //////////////////////////////
  if(State && !Type && !Sort) {
    return [1, 'State'];
  }
  
  if(!State && Type && !Sort) {
    return [1, 'Type'];
  }
  
  if (!State && !Type && Sort) {
    return [1, 'Sort'];
  }
  //////////////////////////////
  if (State && Type && !Sort) {
    return [2, 'State', 'Type'];
  }
  
  if (State && !Type && Sort) {
    return [2, 'State', 'Sort'];
  }
  
  if (!State && Type && Sort) {
    return [2, 'Type', 'Sort'];
  }
  //////////////////////////////
  if(State && Type && Sort) {
    return 3;
  }
}

const lunch = testMe({
   State: false,
   Type: true,
   Sort: null
});

console.log(lunch);