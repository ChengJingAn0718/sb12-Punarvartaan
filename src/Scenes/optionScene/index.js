import React, { useEffect, useRef, useContext, useState } from 'react';
import "../../stylesheets/styles.css";
import BaseImage from '../../components/BaseImage';
import { UserContext } from '../../components/BaseShot';
import { getAudioPath, prePathUrl, setPrimaryAudio, setRepeatAudio, setRepeatType, startRepeatAudio, stopRepeatAudio } from "../../components/CommonFunctions";

import { SIGNALLIST } from "../../components/CommonVarariant"


let answerList = []

let optionList = [0, 1, 1, 1, 2, 2]
let optionType = 0;

let correctNum = 0
let doneCount = 0



const posInfoList = [
    { f: '1', wN: '1', x: 12 },
    { f: '1', wN: '2', x: 42 },
    { f: '1', wN: '3', x: 72 },

    { f: '2', wN: '1', x: 25 },
    { f: '2', wN: '2', x: 60 },

    { f: '3', wN: '1', x: 25 },
    { f: '3', wN: '2', x: 60 },

    { f: '4', wN: '1', x: 25 },
    { f: '4', wN: '2', x: 60 },

    { f: '5', wN: '1', x: 25 },
    { f: '5', wN: '2', x: 60 },

    { f: '6', wN: '1', x: 25 },
    { f: '6', wN: '2', x: 60 },
]

let stepCount = 0;
let optionGroup = [3, 2, 2, 2, 2, 2]

const iconMovePosList = [
    [12, 42, 72],
    [25, 60],
    [41.5, 41.5],
]

let timerList = []

let disableState = false;


const continueSecondList = [
    1, 3
]

const OptionScene = React.forwardRef(({ nextFunc, transSignaler, _geo, continueSecondPart }, ref) => {

    const optionLength = posInfoList.length

    const audioList = useContext(UserContext)
    const parentObject = useRef();

    const textRefList = Array.from({ length: optionLength }, ref => useRef())
    const clickRefList = Array.from({ length: optionLength }, ref => useRef())
    const itemRefList = Array.from({ length: optionLength }, ref => useRef())

    const [isShowLastPart, setShowLastPart] = useState(false)

    useEffect(() => {

        setPositionFomart()
        disableState = false;

        return () => {
            answerList = []
            optionType = 0;
            stepCount = 0;
            correctNum = 0
            doneCount = 0
        }
    }, [])

    React.useImperativeHandle(ref, () => ({
        continueGame: () => {
            //continue games...

            audioList.bodyAudio1.src = getAudioPath('option/' + (stepCount + 1) + '/q')
            audioList.bodyAudio2.src = getAudioPath('option/' + (stepCount + 1) + '/1')

            setPrimaryAudio(audioList.bodyAudio2)
            setRepeatAudio(audioList.commonAudio1)


            parentObject.current.className = 'appear'
            parentObject.current.style.pointerEvents = ''
            timerList[0] = setTimeout(() => {
                audioList.bodyAudio1.play();
                timerList[1] = setTimeout(() => {
                    audioList.bodyAudio2.play();
                    timerList[2] = setTimeout(() => {
                        startRepeatAudio()
                        // audioList.commonAudio1.play();
                    }, audioList.bodyAudio2.duration * 1000 + 300);
                }, audioList.bodyAudio1.duration * 1000 + 300);
            }, 1500);
        },
        startGame: () => {

            audioList.bodyAudio1.src = getAudioPath('option/' + (stepCount + 1) + '/q')
            audioList.bodyAudio2.src = getAudioPath('option/' + (stepCount + 1) + '/1')


            setPrimaryAudio(audioList.bodyAudio2)
            setRepeatAudio(audioList.commonAudio1)
            setRepeatType(1)

            timerList[0] = setTimeout(() => {
                audioList.bodyAudio1.play();
                timerList[1] = setTimeout(() => {
                    audioList.bodyAudio2.play();
                    timerList[2] = setTimeout(() => {
                        startRepeatAudio()
                        audioList.commonAudio1.play();
                    }, audioList.bodyAudio2.duration * 1000 + 300);
                }, audioList.bodyAudio1.duration * 1000 + 600);
            }, 1500);
        }
    }))



    const clickFunc = (num) => {
        stopRepeatAudio();

        audioList.bodyAudio1.pause()
        audioList.bodyAudio2.pause()

        audioList.buzzAudio.pause();


        timerList.map(timer => clearTimeout(timer))

        clickRefList[num].current.style.transition = '0.5s'
        clickRefList[num].current.style.transform = 'scale(0.7)'

        setTimeout(() => {
            clickRefList[num].current.style.transform = 'scale(1)'
            setTimeout(() => {
                judgeFunc(num)
            }, 150);
        }, 100);

        setShowLastPart(true)
    }

    const setPositionFomart = () => {

        for (let i = 0; i < answerList.length; i++) {
            clickRefList[doneCount + i].current.style.left =
                posInfoList[answerList[i]].x + '%'
            clickRefList[doneCount + i].current.style.transition = '0s'
        }
    }

    const goNextStep = () => {

        doneCount += optionGroup[stepCount]
        transSignaler(SIGNALLIST.increaseMark)

        setTimeout(() => {

            if (stepCount < optionGroup.length - 1) {

                correctNum = 0;
                stepCount++;


                let waitTime = 500
                if (continueSecondList.includes(stepCount)) {
                    disableState = true
                    waitTime = 2500
                    setTimeout(() => {
                        continueSecondPart()
                    }, 2000);
                }
                else {
                    audioList.bodyAudio1.src = getAudioPath('option/' + (stepCount + 1) + '/q')
                    audioList.bodyAudio2.src = getAudioPath('option/' + (stepCount + 1) + '/1')
                    disableState = false
                    parentObject.current.className = 'disapear'
                }

                setTimeout(() => {

                    optionType = optionList[stepCount]

                    getRandomAnswerList()

                    itemRefList.map((value, index) => {
                        if (index > doneCount - 1) {
                            if (stepCount != optionGroup.length - 1 && index < doneCount + optionGroup[stepCount]) {
                                if (index == doneCount)
                                    value.current.className = 'showObject'
                                clickRefList[index].current.className = 'showObject'
                            }
                            if (stepCount == optionGroup.length - 1) {
                                if (index == doneCount)
                                    value.current.className = 'showObject'
                                clickRefList[index].current.className = 'showObject'
                            }
                        }
                        else {
                            value.current.className = 'hideObject'
                            clickRefList[index].current.className = 'hideObject'
                        }
                    })

                    setPositionFomart();

                    if (!disableState) {
                        parentObject.current.className = 'appear'
                        parentObject.current.style.pointerEvents = ''
                        timerList[0] = setTimeout(() => {
                            audioList.bodyAudio1.play();
                            timerList[1] = setTimeout(() => {
                                audioList.bodyAudio2.play();
                                timerList[2] = setTimeout(() => {
                                    startRepeatAudio()
                                    // audioList.commonAudio1.play();
                                }, audioList.bodyAudio2.duration * 1000 + 300);
                            }, audioList.bodyAudio1.duration * 1000 + 300);
                        }, 1500);
                    }
                }, waitTime);
            }

            else {
                setTimeout(() => {
                    nextFunc()
                }, 3000);
            }
        }, 1000);
    }

    const getRandomAnswerList = () => {

        answerList = []
        let needLength = optionGroup[stepCount];


        const defaultRandomList = [
            [
                [1, 0]
            ],
            [
                [2, 0, 1], [1, 2, 0]
            ],
            [
                [3, 2, 1, 0], [3, 2, 0, 1],
                [1, 0, 3, 2], [1, 0, 2, 3],
                [2, 3, 1, 0], [2, 3, 0, 1]
            ]
        ]

        let currentNum = needLength - 2

        let randomNumber = Math.floor(Math.random() * defaultRandomList[currentNum].length);

        defaultRandomList[currentNum][randomNumber].map(value => {
            answerList.push(value + doneCount)
        })
    }

    if (answerList.length == 0)
        getRandomAnswerList()

    const judgeFunc = (num) => {
        if (num == doneCount + correctNum) {

            parentObject.current.style.pointerEvents = 'none'
            clickRefList[num].current.style.zIndex = (1000 + doneCount)

            clickRefList[num].current.style.pointerEvents = 'none'
            clickRefList[num].current.style.transition = '0.8s'

            clickRefList[num].current.style.left = iconMovePosList[optionType][correctNum] + '%'
            clickRefList[num].current.style.top = '47%'

            correctNum++

            audioList.tingAudio.currentTime = 0;
            audioList.tingAudio.play();


            if (correctNum == answerList.length || stepCount > 3) {
                setTimeout(() => {
                    goNextStep()
                }, 1000);

            }

            else {
                audioList.bodyAudio2.src = getAudioPath('option/' + (stepCount + 1) + '/' + (correctNum + 1))

                transSignaler(SIGNALLIST.loadSecondPart)  // loadSecond part...

                timerList[0] = setTimeout(() => {
                    itemRefList[doneCount + correctNum].current.className = 'appear'
                    parentObject.current.style.pointerEvents = ''

                    audioList.bodyAudio2.play();
                    timerList[2] = setTimeout(() => {
                        
                        startRepeatAudio()

                    }, audioList.bodyAudio2.duration * 1000 + 300);
                }, 2000);
            }
        }
        else {
            audioList.buzzAudio.currentTime = 0;
            audioList.buzzAudio.play();

            timerList[1] = setTimeout(() => {
                audioList.bodyAudio2.currentTime = 0
                audioList.bodyAudio2.play();
                timerList[2] = setTimeout(() => {
                    startRepeatAudio()
                }, audioList.bodyAudio2.duration * 1000);
            }, 1000);
        }
    }

    return (
        <div ref={parentObject}
            style={{
                position: "fixed", width: _geo.width + "px"
                , height: _geo.height + "px",
                left: _geo.left + 'px',
                top: _geo.top + 'px',
            }}
        >
            {
                posInfoList.map((value, index) =>
                    (isShowLastPart || index < optionGroup[0]) &&


                    <div
                        key={index}
                        ref={itemRefList[index]}
                        style={{
                            position: "absolute",
                            width: '100%'
                            , height: '100%',
                            left: 0 + '%',
                            top: '0%',
                            pointerEvents: 'none'
                        }}
                        className={index == 0 ? '' : 'hideObject'}
                    >

                        <BaseImage
                            scale={0.22}
                            posInfo={{
                                l: index < 9 ? (posInfoList[index].x - 3) / 100 : 0.39,
                                b: 0.11
                            }}
                            ref={textRefList[index]}
                            url={"option/" + value.f + "/" + value.wN + "a.png"}
                        />
                    </div>

                )
            }
            {
                posInfoList.map((value, index) =>
                    (isShowLastPart || index < optionGroup[0]) &&
                    <div
                        className={index > optionGroup[0] - 1 ? 'hideObject' : ''}
                        ref={clickRefList[index]}
                        onClick={() => { clickFunc(index) }}
                        style={{
                            position: 'absolute',
                            top: 30 + '%',
                            width: 17 + '%',
                            height: 30 + '%',
                            borderRadius: '50%',
                            left: posInfoList[index].x + 0 + '%',
                            top: '16%',
                            cursor: 'pointer',
                        }}>
                        <BaseImage
                            posInfo={{ l: 0, t: 0 }}
                            url={"option/" + value.f + "/" + value.wN + ".png"}
                        />
                    </div>
                )
            }

        </div >
    );
});

export { OptionScene };
