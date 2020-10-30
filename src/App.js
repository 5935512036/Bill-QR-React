import React, { useState } from 'react';
import * as qrcode from 'qrcode'
import * as generatePayload from 'promptpay-qr'
import ReadCSV from './components/ReadCSV';

const MOBILE_NUMBER = '098-679-7379';

const generateQRFile = (mobileNumber, amount) => {
    return new Promise((resolve, reject) => {
        const payload = generatePayload(mobileNumber, { amount })
        const options = { type: 'svg', color: { dark: '#003b6a', light: '#f7f8f7' } }
        qrcode.toDataURL(payload, options, (err, svg) => {
            if (err) return reject(err)
            resolve(svg)
        })
    })
}

function App() {

  const [list, setList] = useState([]);

  const handleReadCSV = async (col, data) => {
    const testCol = col.map(c => c.name);
    const correctFormat = testCol.includes('Room') && testCol.includes('Amount');

    console.log(testCol)

    if (correctFormat) {
      const promises = data.map(async(item, index) => {
        const qr = await generateQRFile(MOBILE_NUMBER, +item.Amount);
        return { room: item.Room, amount: item.Amount, qr };
      });
  
      const outputs = await Promise.all(promises);
  
      setList(outputs);
    } else {
      console.log("Error format")
    }

  }

  return (
    <div className="App">
      <div className='grid'>
        {
          list.map((item, index) => (
            <div className='grid-item' key={index}>
              <h3>{item.room}: {item.amount} Baht</h3>
              <img alt='qr' src={item.qr}/>
            </div>
          ))
        }
      </div>
      { list.length === 0 && <ReadCSV onChange={handleReadCSV}/>}
    </div>
  );
}

export default App;
