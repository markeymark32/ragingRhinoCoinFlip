import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { utils, connect, keyStores, transactions } from "near-api-js";
import DiscreteSliderValues from './Slider';
import getConfig from '../config'
import { classImplements } from '@babel/types';

export const GamePlay=()=>{
    const [ deposit, setDeposit ] = useState(0);
    const [ coin, setCoin ] = useState("");
    const [ credits, setCredits ] = useState();
    const [ lastResult, setLastResult ] = useState();

    useEffect(async () => {
        let credits = await window.contract.get_chance({ account_id: window.accountId }).catch(err => {
          console.log(err)
        });
        setCredits(credits);
    }, []);

    const Clear = async () => {
        setDeposit(0);
        setCoin("");
    }

    const SetCoin = async (e) => {
        setCoin(e.target.value);
    }
    
    const AddBet = async (e) => {
        setDeposit(prevDeposit => prevDeposit + Number(e.target.value));
        if({deposit} > 10){
            setDeposit(10);
        }
    }

    const Flip = async () => {
        console.log({coin});
        const nearConfig = getConfig(process.env.NODE_ENV || 'development')
        const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))
        const depositValue = {deposit};
        const flippedCoin = {coin};
        const contractId = window.contract.contractId;
        const account = await near.account(window.accountId);

        if(flippedCoin["coin"]!= "") {
            if(depositValue["deposit"]!=0){
                await account.functionCall({
                    contractId: contractId,
                    methodName:"play",
                    bet_value:flippedCoin["coin"],
                    gas : '300000000000000',
                    attachedDeposit : utils.format.parseNearAmount(depositValue["deposit"]),
                }).then(async result => {
                    console.log(result);
                    if (result){
                        setLastResult("Win");
                    } else {
                        setLastResult("Lose");
                    }
                    let credits = await window.contract.get_chance({ account_id: window.accountId }).catch(err => {
                        console.log(err)
                    });
                    setCredits(credits);
                });
            } else {
                alert("You must deposit a bet to play");
            }
        } else {
            alert("You must chose heads or tails");
        }
    };

    const Claim = async () => {

    }

        return (
            <Container id="game">
                <Row className="justify-content-md-center text-center">
                    <Col xs lg="8">
                        <span>Select the Ⓝ amount to flip</span>
                    </Col>
                </Row>
                <Row className="justify-content-md-center text-center">
                    <Col xs lg="8">
                        <Button className="btn" variant="secondary" size="sm" style={{ background: "#cc3300"}} onClick={()=>Clear()}>Clear</Button>{' '}
                        <Button className="btn" variant="secondary" size="sm" value="0.05" onClick={(e)=>AddBet(e)}>+0.05</Button>{' '}
                        <Button className="btn" variant="secondary" size="sm" value="0.5" onClick={(e)=>AddBet(e)}>+0.5</Button>{' '}
                        <Button className="btn" variant="secondary" size="sm" value="1" onClick={(e)=>AddBet(e)}>+1</Button>{' '}
                        <Button className="btn" variant="secondary" size="sm" value="10" onClick={(e)=>AddBet(e)}>+10</Button>{' '}
                        <Button className="btn" variant="secondary" size="sm" value="1/2" onClick={(e)=>AddBet(e)}>1/2</Button>{' '}
                        <Button className="btn" variant="secondary" size="sm" value="x2" onClick={(e)=>AddBet(e)}>x2</Button>{' '}
                        <Button className="btn" variant="secondary" size="sm" value="MAX" onClick={(e)=>setDeposit(Number(e))}>MAX</Button>{' '}
                        <Button className="btn" variant="secondary" size="sm" style={{ background: "#cc3300"}} onClick={()=>Flip()}>Flip</Button>
                    </Col>
                </Row>
                <Row className="justify-content-md-center text-center">
                    <Col xs lg="8">
                        <img id="coin" className="coin" src={require("../assets/heads.svg")} ></img>
                    </Col>
                </Row>
                <Row className="justify-content-md-center text-center">
                    <Col xs lg="8">
                            <Button id="heads" className="btn" variant="secondary" size="sm" value="heads" onClick={e => SetCoin(e)}>Heads</Button>{' '}
                            <Button id="tails" className="btn" variant="secondary" size="sm" value="tails" onClick={e => SetCoin(e)}>Tails</Button>{' '}
                    </Col>
                </Row>
                <Row className="justify-content-md-center text-center">
                    <Col xs lg="8">
                        <p>Current Bet {deposit} N</p>
                    </Col>
                </Row>
                <Row className="justify-content-md-center text-center">
                    <Col xs lg="8">
                        <div id="claim" style={{ display: "flex", justifyContent: "center" }}>
                                <Button variant="secondary" style={{ background: "#cc3300"}} onClick={()=>Claim()}>Claim Reward</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
}