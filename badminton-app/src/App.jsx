import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import React, { useState, useEffect,useRef, useMemo } from 'react';
import { Layout, InputNumber, notification, Button, Typography, Row, Col } from 'antd';
import usePreventScrollOnKeyboard from './usePreventScrollOnKeyboard';

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
    const [hours, setHours] = useState(2);
    const [pricePerHour, setPricePerHour] = useState(110000);
    const [maleCount, setMaleCount] = useState(0);
    const [femaleCount, setFemaleCount] = useState(0);
    const [femalePrice, setFemalePrice] = useState(45000);
    const [childCount, setChildCount] = useState(0);
    const [childPrice, setChildPrice] = useState(40000);
    const [shuttlecockCount, setShuttlecockCount] = useState(0);
    const [shuttlecockPrice, setShuttlecockPrice] = useState(0);
    const [result, setResult] = useState('');
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const maleCountRef = useRef(null);
    const shuttlecockCountRef = useRef(null);
    const pricePerHourRef = useRef(null);
    const shuttlecockPriceRef = useRef(null);
    const [init, setInit] = useState(false);
    usePreventScrollOnKeyboard();
useEffect(() => {
    const savedValues = JSON.parse(localStorage.getItem('badmintonApp'));
    if (savedValues) {
        setPricePerHour(savedValues.pricePerHour || 0);
        setFemalePrice(savedValues.femalePrice || 0);
        setChildPrice(savedValues.childPrice || 0);
        setShuttlecockPrice(savedValues.shuttlecockPrice || 0);
        
    }
}, []);

useEffect(() => {
initParticlesEngine(async (engine) => {
    
    await loadSlim(engine);
}).then(() => {
    setInit(true);
});
}, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };
  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "#000",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 2,
          },
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 150,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

const calculateCost = () => {
    if(pricePerHour == 0 || shuttlecockPrice == 0){
        showMessage('Thiết lập đủ cài đặt!')
        return false
    }
   
    if (shuttlecockCount > 0 && hours > 0) {
        const totalFemaleCost = femaleCount * (femalePrice || 0) ;
        const totalChildCost = childCount * (childPrice || 0);
        const totalShuttlecockCost = shuttlecockCount * (shuttlecockPrice || 0);
        const totalCost = hours * pricePerHour  - (totalFemaleCost + totalChildCost);
        const maleShare = (totalCost + totalShuttlecockCost) / maleCount;
        setResult(`Giá mỗi người: ${formatNumber(maleShare.toFixed(0))}`);
        return false
    } 

    if(hours == 0) {
        showMessage('Nhập cmn số giờ vào!')
        return false
    }

    if(maleCount == 0) {
        showMessage('Nhập số lượng người chơi vào!')
        return false
    }
    if(shuttlecockCount == 0){
        showMessage('Nhập số lượng cầu vào!')
        return false
    }
};

const showMessage = (message) => {
    notification.open({
        message: <span style={{color: "red"}}>Anh nhắc em:</span>,
        description: message,
        placement: 'top', 
        duration: 4,
    });
}

const resetFields = () => {
    setMaleCount(0);
    setFemaleCount(0);
    setChildCount(0);
    setShuttlecockCount(0)
    setResult('');
};

const saveToLocalStorage = () => {
    const valuesToSave = {
        pricePerHour,
        femalePrice,
        childPrice,
        shuttlecockPrice,
    };
    localStorage.setItem('badmintonApp', JSON.stringify(valuesToSave));
    if(pricePerHour == 0){
        showMessage('Nhập giá tiền vào!')
        return false
    }
   
    if(shuttlecockPrice == 0){
        showMessage('Nhập giá cầu vào!')
        return false
    }

    setIsSettingsVisible(false)
    resetFields()
};

const formatNumber = (number) =>{
    return  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

return (
    <Layout  style={{backgroundColor: "transparent", overflow: "hidden"}} >
         <Header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position:"fixed", top: 0, zIndex: 3, width: "100%"}} >
            <span style={{ color: 'white', fontSize: "20px" }}>Badminton KKD Cost</span>
        </Header>
        <div  style={{ overflowY:"auto", zIndex: 2, overflowX:"hidden", backgroundColor: "transparent" }}>
       
           {
            init && <Particles
            style={{zIndex: -1}}
             id="tsparticles"
             particlesLoaded={particlesLoaded}
             options={options}
           />
           }
       
        <Content style={{ padding: '20px'}}>
                
            {
                !isSettingsVisible && <div style={{display: "flex", justifyItems:"space-between", alignItems: "center", width: "100%"}}>
                 <div><Button onClick={()=>setIsSettingsVisible(true)} type="primary" >Cài đặt</Button></div>
                 <div style={{color: "red", marginLeft: "10px", fontSize: "20px", fontWeight:"bold", position: "relative"}} className="thodo">{result}</div>
                </div>
              
            }
             
            { isSettingsVisible ?<div>
         
            <Row gutter={16}>
                <Col span={12}>
                    <div>
                        <Title style={{ color: 'white' }} level={5}>Giá tiền 1 giờ:</Title>
                        <InputNumber
                            min={0} 
                            value={pricePerHour}
                            onChange={setPricePerHour} 
                            ref={pricePerHourRef}
                            style={{ width: '100%' }} />
                    </div>
                    <div >
                        <Title level={5} style={{ color: 'white' }}>Giá 1 quả cầu:</Title>
                        <InputNumber
                            min={0}
                            value={shuttlecockPrice} 
                            onChange={setShuttlecockPrice} 
                            style={{ width: '100%' }}
                            ref={shuttlecockPriceRef}
                            />
                    </div>
                    </Col>
                    <Col span={12}>
                    <div >
                        <Title level={5} style={{ color: 'white' }}>Giá nữ:</Title>
                        <InputNumber 
                            min={0} 
                            value={femalePrice} 
                            onChange={setFemalePrice} 
                            style={{ width: '100%' }} 
                        />
                    </div>
                    
                    <div>
                        <Title level={5} style={{ color: 'white' }}>Giá trẻ em:</Title>
                        <InputNumber 
                            min={0} 
                            value={childPrice} 
                            onChange={setChildPrice} 
                            style={{ width: '100%' }} 
                        />
                    </div>
                    {
                        isSettingsVisible && <div style={{ marginTop: 50 }} >
                        <Button onClick={() => setIsSettingsVisible(false)} type="primary" >  Quay lại </Button>
                        <Button onClick={saveToLocalStorage} type="primary" style={{ marginLeft: 8 }} >  Lưu </Button>
                        </div> 
                        
                    }
                </Col>
                <Row></Row>
            </Row>
            </div> :
            <div>
            <Row gutter={16}>
                <Col span={12}>
                    <div>
                        <Title level={5} style={{ color: 'white' }}>Số giờ:</Title>
                        <InputNumber min={0} value={hours} onChange={setHours} style={{ width: '100%' }} />
                    </div>
                    <div >
                        <Title level={5} style={{ color: 'white' }}>Số lượng người chơi:</Title>
                        <InputNumber 
                            min={0} 
                            value={maleCount} 
                            onChange={setMaleCount} 
                            style={{ width: '100%' }}
                            ref={maleCountRef}
                            />
                    </div>
                    <div style={{ marginBottom: '5px' }}>
                        <Title level={5} style={{ color: 'white' }}>Số lượng cầu:</Title>
                        <InputNumber
                            min={0} 
                            value={shuttlecockCount} 
                            onChange={setShuttlecockCount} 
                            style={{ width: '100%' }} 
                            ref={shuttlecockCountRef}
                            />
                    </div>
                    </Col>
                    <Col span={12}>
                    <div>
                        <Title level={5} style={{ color: 'white' }}>Số lượng nữ:</Title>
                        <InputNumber 
                            min={0} 
                            value={femaleCount} 
                            onChange={setFemaleCount} 
                            style={{ width: '100%' }} 
                        />
                    </div>
                    <div >
                        <Title level={5} style={{ color: 'white' }}>Số lượng học sinh:</Title>
                        <InputNumber 
                            min={0} 
                            value={childCount} 
                            onChange={setChildCount}   
                            style={{ width: '100%' }} 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", marginTop: 50 }}>  <Button type="primary" onClick={calculateCost}>Tính tiền</Button>
                           <Button onClick={resetFields} type="primary" style={{ marginLeft: '10px' }}>Reset</Button>
                    </div>
                </Col>
            </Row>
            </div>}
            <Row   style={{ position: 'absolute', bottom: 2, zIndex: 1 }}>
                <div > <span style={{ fontSize: 12, color: "#cccc"}}><a href="https://www.facebook.com/thodo7199">Create by: Thodo(Anthony)</a></span></div>
             </Row>
            
        </Content>
        </div>
    </Layout>
    );
};

export default App;
