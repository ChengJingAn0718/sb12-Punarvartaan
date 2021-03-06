import React, { useEffect, useRef, useContext, useState } from 'react';
import "../stylesheets/styles.css";
import BaseImage from '../components/BaseImage';
import { UserContext } from '../components/BaseShot';
import { getAudioPath, prePathUrl, setExtraVolume } from "../components/CommonFunctions";
import { MaskComponent } from "../components/CommonComponents"


const maskPathList = [
    ['sub'],
    ['3'],
    ['4'],
    ['5'],
    ['6'],
    ['7'],
    ['8'],
    ['9'],
    ['sub'],
    ['sub'],
    ['sub'],
    ['sub'],
]


const maskTransformList = [
    { x: 0.25, y: 0.05, s: 1.5 },
    { x: -0.3, y: -0.25, s: 1.8 },
    { x: 0.3, y: -0.2, s: 1.8 },

    { x: 0.4, y: -0.3, s: 1.8 },

    { x: -0.3, y: -0.4, s: 1.8 },

    { x: 0.3, y: -0.4, s: 1.8 },

    { x: -0.15, y: 0.2, s: 1.8 },

    { x: -0.3, y: 0.3, s: 1.6 },


    { x: 0.0, y: 0.0, s: 1 },
    { x: 0.0, y: 0.0, s: 1 },
    { x: 0.0, y: 0.0, s: 1 },
    { x: 0.0, y: 0.0, s: 1 },
]

let currentMaskNum = 0;
let subMaskNum = 0;

// plus values..
const marginPosList = [
    { s: 2, l: 0.3, t: 0.7 },
    { s: 2, l: -0.2, t: -0.4 },
    { s: 2, l: 0.3, t: -0.3 },
    { s: 2, l: 0.5, t: -0.3 },
    { s: 2, l: -0.4, t: -0.4 },
    { s: 2, l: 0.4, t: -0.4 },
    { s: 2, l: -0.3, t: 0.4 },
    { s: 1, l: -0.2, t: 0.4 },
    { s: 2, l: 0.4, t: -0.1 },
    { s: 2, l: 0.5, t: 0.3 },
    { s: 3, l: 0.7, t: 0.2 },
    { s: 2, l: -0.45, t: 0.5 },
]

const audioPathList = [
    ['3'],
    ['4'],
    ['5'],
    ['6'],
    ['7'],
    ['8'],
    ['9'],
    ['10'],
    ['11'],
    ['12'],
    ['13'],
    ['14'],
]

const subMarkInfoList = [
    [
        { p: '1', t: 2500, ps: 2, pl: 0.6, pt: 0.4 },
        { p: '2', t: 5500, ps: 2, pl: 0.6, pt: 0.6 },
    ],
    [
        { p: '10', t: 7500, ps: 2, pl: 0.4, pt: 0.4 },
        { p: '11', t: 9000, ps: 2, pl: 0.4, pt: 0.4 },
        { p: '12', t: 11000, ps: 2, pl: 0.3, pt: -0.4 },
    ],
    [
        { p: '13', t: 8300, ps: 2, pl: 0.0, pt: 0 },
        { p: '14', t: 9800, ps: 2, pl: 0.5, pt: -0.4 },
        { p: '15', t: 11000, ps: 2, pl: 0.2, pt: -0.2 },
    ],
    [
        { p: '16', t: 8000, ps: 2, pl: -0.3, pt: -0.3 },
        { p: '17', t: 9500, ps: 2, pl: 0.1, pt: -0.3 },
        { p: '5', t: 11000, ps: 2, pl: 0.3, pt: -0.1 },
    ],
    [
        { p: '18', t: 8500, ps: 2, pl: -0.45, pt: 0.5 },
    ]
]
const Scene = React.forwardRef(({ nextFunc, _baseGeo, loadFunc, _startTransition, bgLoaded }, ref) => {

    const audioList = useContext(UserContext)

    const baseObject = useRef();
    const blackWhiteObject = useRef();
    const colorObject = useRef();
    const currentImage = useRef()
    const subMaskRefList = Array.from({ length: 3 }, ref => useRef())


    const wordTextList = Array.from({ length: 4 }, ref => useRef())

    const [isSubMaskLoaded, setSubMaskLoaded] = useState(false)

    const [isSceneLoad, setSceneLoad] = useState(false)



    React.useImperativeHandle(ref, () => ({
        sceneLoad: () => {
            setSceneLoad(true)
        },
        sceneStart: () => {
            baseObject.current.className = 'aniObject'
            loadFunc()

            audioList.bodyAudio1.src = getAudioPath('intro/' + audioPathList[currentMaskNum][0]);
            audioList.bodyAudio2.src = getAudioPath('intro/2');

            // 3 to 6

            setExtraVolume(audioList.bodyAudio1, 6)
            setExtraVolume(audioList.bodyAudio2, 6)

            blackWhiteObject.current.style.WebkitMaskImage = 'url("' +
                returnImgPath(maskPathList[1][0], true) + '")'

            blackWhiteObject.current.style.transition = "0.5s"
            currentImage.current.style.transition = '0.5s'

            setTimeout(() => {
                setSubMaskLoaded(true)

                audioList.bodyAudio2.play()


                setTimeout(() => {
                        showIndividualImage()
                }, audioList.bodyAudio2.duration * 1000 + 1000);
            }, 3000);
        },
        sceneEnd: () => {
            currentMaskNum = 0;
            subMaskNum = 0
            setSceneLoad(false)
        }
    }))

    function returnImgPath(imgName, isAbs = false) {
        return isAbs ? (prePathUrl() + 'images/intro/' + imgName + '.png')
            : ('intro/' + imgName + '.png');
    }

    const durationList = [
        2, 1, 1, 1.4, 1.4, 1.4, 1, 1, 1, 1.4, 1.4, 1.4, 1.5, 1.5
    ]
    function showIndividualImage() {
        blackWhiteObject.current.className = 'hideObject'
        let currentMaskName = maskPathList[currentMaskNum][0]

        baseObject.current.style.transition = durationList[currentMaskNum] + 's'

        baseObject.current.style.transform =
            'translate(' + maskTransformList[currentMaskNum].x * 100 + '%,'
            + maskTransformList[currentMaskNum].y * 100 + '%) ' +
            'scale(' + maskTransformList[currentMaskNum].s + ') '

        setTimeout(() => {
            let timeDuration = audioList.bodyAudio1.duration * 1000 + 500
            let isSubAudio = false

            if (audioPathList[currentMaskNum].length > 1) {
                timeDuration += (audioList.bodyAudio3.duration * 1000 - 1000)
                isSubAudio = true;
            }

            if (currentMaskNum > 7)
                wordTextList[currentMaskNum - 8].current.setClass('appear')

            if (currentMaskName != 'sub') {
                blackWhiteObject.current.className = 'show'
                colorObject.current.className = 'hide'
            }
            else {


                subMarkInfoList[subMaskNum].map((value, index) => {
                    setTimeout(() => {
                        if (index == 0)
                            colorObject.current.className = 'hide'
                        subMaskRefList[index].current.setClass('appear')
                        if (value.ps != null) {
                            subMaskRefList[index].current.setStyle({
                                transform:
                                    "translate(" + _baseGeo.width * value.pl / 100 + "px,"
                                    + _baseGeo.height * value.pt / 100 + "px)"
                                    + "scale(" + (1 + value.ps / 100) + ") "
                            })

                        }
                    }, value.t);
                })
            }

            if (maskPathList[currentMaskNum].length > 1) {
                maskPathList[currentMaskNum].map((value, index) => {
                    setTimeout(() => {
                        if (index > 0) {
                            blackWhiteObject.current.style.WebkitMaskImage = 'url("' +
                                returnImgPath(maskPathList[currentMaskNum][index], true) + '")'
                        }


                    }, (audioList.bodyAudio1.duration * 1000 + 1000) / maskPathList[currentMaskNum].length * index);
                }
                )
            }

            setTimeout(() => {

                if (marginPosList[currentMaskNum].s != null) {
                    currentImage.current.style.transform =
                        "translate(" + _baseGeo.width * marginPosList[currentMaskNum].l / 100 + "px,"
                        + _baseGeo.height * marginPosList[currentMaskNum].t / 100 + "px)"
                        + "scale(" + (1 + marginPosList[currentMaskNum].s / 100) + ") "
                }


                audioList.bodyAudio1.play().catch(error => { });
                if (isSubAudio)
                    setTimeout(() => {

                        setTimeout(() => {
                            audioList.bodyAudio3.play();
                        }, 500);
                    }, audioList.bodyAudio1.duration * 1000 + 500);

                setTimeout(() => {
                    if (currentMaskNum < audioPathList.length - 1) {
                        audioList.bodyAudio1.src = getAudioPath('intro/' + audioPathList[currentMaskNum + 1][0]);
                        if (audioPathList[currentMaskNum + 1].length > 1)
                            audioList.bodyAudio3.src = getAudioPath('intro/' + audioPathList[currentMaskNum + 1][1]);
                    }

                    setTimeout(() => {
                        currentImage.current.style.transform = "scale(1)"
                        if (currentMaskName == 'sub') {
                            subMaskRefList.map(mask => {
                                if (mask.current) {
                                    mask.current.setStyle({
                                        transform: "scale(1)"
                                    })
                                }
                            })
                        }

                        setTimeout(() => {
                            colorObject.current.className = 'show'
                        }, 300);

                        setTimeout(() => {
                            if (currentMaskNum == maskPathList.length - 1) {
                                setTimeout(() => {
                                    baseObject.current.style.transition = '2s'

                                    baseObject.current.style.transform =
                                        'translate(' + '0%,0%)' +
                                        'scale(1)'

                                    setTimeout(() => {
                                        nextFunc()
                                    }, 5000);

                                }, 2000);
                            }
                            else {
                                if (currentMaskNum > 7)
                                    wordTextList[currentMaskNum - 8].current.setClass('hide')

                                if (currentMaskName == 'sub') {


                                    subMaskRefList.map(mask => {
                                        if (mask.current) {

                                            setTimeout(() => {
                                                mask.current.setClass('hide')
                                            }, 500);
                                        }
                                    })
                                    subMaskNum++
                                }

                                currentMaskNum++;

                                currentMaskName = maskPathList[currentMaskNum][0]
                                if (currentMaskName != 'sub')
                                    blackWhiteObject.current.style.WebkitMaskImage = 'url("' +
                                        returnImgPath(maskPathList[currentMaskNum], true) + '")'
                                else
                                    subMarkInfoList[subMaskNum].map((value, index) => {
                                        subMaskRefList[index].current.setMask(returnImgPath(value.p, true))
                                    })

                                blackWhiteObject.current.className = 'hide'
                                setTimeout(() => {
                                    showIndividualImage()
                                }, 2000);

                            }
                        }, 500);
                    }, 2000);
                }, timeDuration);
            }, 1000);

        }, durationList[currentMaskNum] * 1000);
    }

    return (
        <div>
            {
                isSceneLoad &&
                <div ref={baseObject}
                    className='hideObject'
                    style={{
                        position: "fixed", width: _baseGeo.width + "px"
                        , height: _baseGeo.height + "px",
                        left: _baseGeo.left + 'px',
                        top: _baseGeo.top + 'px',
                    }}
                >
                    <div
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%'
                        }} >
                        <img
                            width={'100%'}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',

                            }}
                            src={returnImgPath('grey_bg', true)}
                        />
                    </div>

                    <div
                        ref={blackWhiteObject}
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%',
                            WebkitMaskImage: 'url("' +
                                returnImgPath(maskPathList[1][0], true)
                                + '")',
                            WebkitMaskSize: '100% 100%',
                            WebkitMaskRepeat: "no-repeat"
                        }} >

                        <div
                            ref={currentImage}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <BaseImage
                                url={'bg/base.png'}
                            />

                    

                        </div>
                    </div>

                    {
                        isSubMaskLoaded && subMarkInfoList[0].map((value, index) =>
                            <MaskComponent
                                ref={subMaskRefList[index]}
                                maskPath={returnImgPath(value.p, true)}
                            />

                        )
                    }

                    {
                        isSubMaskLoaded &&
                        <MaskComponent
                            ref={subMaskRefList[2]}
                            maskPath={returnImgPath('12', true)}
                        />
                    }
                    <div
                        ref={colorObject}
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%',
                        }} >
                        <BaseImage
                            url={'bg/base.png'}
                            onLoad={bgLoaded}
                        />
                    </div>

                    {
                        wordTextList.map((value, index) =>
                            <BaseImage
                                className='hideObject'
                                ref={value}
                                scale={0.2}
                                posInfo={{
                                    l: 0.75,
                                    t: 0.2,
                                }}
                                url={'intro/t' + (index + 1) + '.png'}
                            />
                        )

                    }
                </div>}
        </div>
    );
});

export default Scene;
