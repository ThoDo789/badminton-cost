import React, { useState, useEffect,useRef } from 'react';
import { Layout, InputNumber, notification, Button, Typography, Alert, Row, Col } from 'antd';
import label from "./assets/image/image.png"
import image from "./assets/image/anh.jpeg"
const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
    const [hours, setHours] = useState(2);
    const [hoursSetting, setHoursSetting] = useState(2);
    const [totalYard, setTotalYard] = useState(1);
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

useEffect(() => {
    const savedValues = JSON.parse(localStorage.getItem('badmintonApp'));
    if (savedValues) {
        setPricePerHour(savedValues.pricePerHour || 0);
        setFemalePrice(savedValues.femalePrice || 0);
        setChildPrice(savedValues.childPrice || 0);
        setShuttlecockPrice(savedValues.shuttlecockPrice || 0);
        setHours(savedValues.hoursSetting || 0);
    }
}, []);

  useEffect(() => {
    const savedValues = JSON.parse(localStorage.getItem('badmintonApp'));
    setHours((savedValues?.hoursSetting || 2) * totalYard)
}, [totalYard]);

useEffect(() => {
  getTotalHour()
}, [childCount, femaleCount,maleCount ]);

const calculateCost = () => {
    
    const totalPrice =  hours * pricePerHour;
    if (maleCount > 0 && shuttlecockCount > 0) {
        const totalFemaleCost = femaleCount * (femalePrice || 0) ;
        const totalChildCost = childCount * (childPrice || 0);
        const totalShuttlecockCost = shuttlecockCount * (shuttlecockPrice || 0);
        const totalCost = totalPrice  - (totalFemaleCost + totalChildCost);
        const maleShare = (totalCost + totalShuttlecockCost) / maleCount;
        setResult(`Giá mỗi người: ${formatNumber(maleShare.toFixed(0))}`);
        return false
    } 
    if(maleCount == 0) {
        notification.open({
            message: 'Thông báo',
            description: 'Vui lòng nhập số lượng nam!',
            placement: 'bottomRight', 
            duration: 2, 
          });
        focusMaleCount()
        return false
    }
    if(shuttlecockCount == 0){
        notification.open({
            message: 'Thông báo',
            description: 'Vui lòng nhập số lượng cầu!',
            placement: 'bottomRight', 
            duration: 2,
          });
        focusShuttlecockCount()
        return false
    }
};

const getTotalHour = () =>{
    let totalPlayer = childCount + femaleCount + maleCount
    let totalYardCalc = Math.ceil(totalPlayer / 8);
    totalYardCalc = totalYardCalc === 0 ? 1 : totalYardCalc
    setTotalYard(totalYardCalc)
} 

const resetFields = () => {
    const savedValues = JSON.parse(localStorage.getItem('badmintonApp'));
    setHours(savedValues?.hoursSetting || 0);
    setTotalYard(1)
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
        hoursSetting
    };
    localStorage.setItem('badmintonApp', JSON.stringify(valuesToSave));
    setIsSettingsVisible(false)
    resetFields()
};

const formatNumber = (number) =>{
    return  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}
const focusMaleCount = () => {
    maleCountRef.current.focus();
  };

  const focusShuttlecockCount = () => {
    shuttlecockCountRef.current.focus();
  };
return (
    <Layout style={{ width: '100vw',height: '100vh', display: "flex", justifyContent: "center", alignItems:"center"}} >
        <div  style={{ width: "100%", border: "1px solid #ccc", borderRadius: "5px", height: "100%", backgroundColor: "#ffff", overflow:"hidden", zIndex: 2 }}>
        <Header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
            <Title style={{ color: 'white', fontSize: "20px" }}>Badminton KKD Cost</Title>
        </Header>
        <Content style={{ padding: '20px' }}>
                
            {
                !isSettingsVisible && 
                <Button onClick={()=>setIsSettingsVisible(true)} type="primary" >Cài đặt</Button>
            }
             
            { isSettingsVisible ?<div>
         
            <Row >
                <Col span={24}>
                    <div>
                        <Title level={5}>Giá tiền 1 giờ:</Title>
                        <InputNumber min={0} value={pricePerHour} onChange={setPricePerHour} 
                            style={{ width: '100%' }} />
                    </div>
                    <div >
                        <Title level={5}>Giá 1 quả cầu:</Title>
                        <InputNumber min={0} value={shuttlecockPrice} onChange={setShuttlecockPrice} 
                            style={{ width: '100%' }} />
                    </div>
                    <div>
                        <Title level={5}>Số giờ 1 sân:</Title>
                        <InputNumber min={0} value={hoursSetting} onChange={setHoursSetting} style={{ width: '100%' }} />
                    </div>
                    <div >
                        <Title level={5}>Giá nữ:</Title>
                        <InputNumber min={0} value={femalePrice} onChange={setFemalePrice} style={{ width: '100%' }} />
                    </div>
                    <div>
                        <Title level={5}>Giá trẻ em:</Title>
                        <InputNumber min={0} value={childPrice} onChange={setChildPrice} style={{ width: '100%' }} />
                    </div>
                </Col>
                <Row>{
                        isSettingsVisible && <div style={{ marginTop: 10 }} >
                        <Button onClick={() => setIsSettingsVisible(false)} type="primary" >  Quay lại </Button>
                        <Button onClick={saveToLocalStorage} type="primary" style={{ marginLeft: 8 }} >  Lưu </Button>
                        </div> 
                        
                    }</Row>
            </Row>
            </div> :
            <div>
            <Row>
                <Col span={24}>
                    <div>
                        <Title level={5}>{`Số giờ ${totalYard} sân:`}</Title>
                        <InputNumber min={1} value={hours}
                            style={{ width: '100%' }} />
                    </div>
                    <div>
                        <Title level={5}>Giá tiền 1 giờ:</Title>
                        <InputNumber min={0} value={pricePerHour} onChange={setPricePerHour} 
                            style={{ width: '100%' }}
                            disabled={!isSettingsVisible}
                            />
                    </div>
                    <div >
                        <Title level={5}>Số lượng nam:</Title>
                        <InputNumber min={0} value={maleCount} onChange={setMaleCount} 
                            style={{ width: '100%' }}
                            ref={maleCountRef}
                            />
                    </div>
                    <div>
                        <Title level={5}>Số lượng nữ:</Title>
                        <InputNumber min={0} value={femaleCount} onChange={setFemaleCount} 
                            style={{ width: '100%' }} />
                    </div>
                    <div >
                        <Title level={5}>Số lượng trẻ em:</Title>
                        <InputNumber min={0} value={childCount} onChange={setChildCount}   style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '5px' }}>
                        <Title level={5}>Số lượng cầu:</Title>
                        <InputNumber min={0} value={shuttlecockCount} onChange={setShuttlecockCount} 
                            style={{ width: '100%' }} 
                            ref={shuttlecockCountRef}
                            />
                    </div>
                </Col>
            </Row>
             <Row>
             <Col>
                <Button type="primary" onClick={calculateCost}>Tính tiền</Button>
                <Button onClick={resetFields} type="primary" style={{ marginLeft: '10px' }}>Reset</Button>
                <Title level={5} >{result}</Title>
                </Col>
             </Row>
            
            </div>}
            <Row   style={{ position: 'absolute', bottom: 2, zIndex: 1 }}>
                <Col span={15}>
                   <img src={label} height="100px" width="100%"/>
                </Col>
                <Col span={9}>
                   <img src={image} height="auto" width="100px"/>
                </Col>
                <div > <span style={{ fontSize: 12, color: "#cccc"}}><a href="https://www.facebook.com/thodo7199">Create by: Thodo(Anthony)</a></span></div>
             </Row>
            
        </Content>
        </div>
    </Layout>
    );
};

export default App;
