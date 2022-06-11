const axios = require('axios');

class ServicioPLN {
  _instancia;

  constructor(){
    this.config = {
      method: 'POST',
      url: 'http://localhost:5000/',
      headers: { 
        'Content-Type': 'application/json'
      }
    };
  }
  

  static getInstancia() {
    if (!this._instancia) {
      this._instancia = new ServicioPLN();
    }
    return this._instancia;
  }
 buscarSimilitud = async (data, endpoint) => {
   try{
     const newConfig = {...this.config, url: this.config.url + endpoint, data: JSON.stringify(data)}
     const res = await axios(newConfig);
     return await res.data;
   }catch(err){
    console.log(err);
     return null;
   }
  
 }

}

module.exports = { ServicioPLN };
