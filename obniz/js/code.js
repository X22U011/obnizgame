//各の数字のタイマー
var leftTimer;
var centerTimer;
var rightTimer;

var vis = 100;
var aida = 30;

//各数字
let numElements = document.getElementsByClassName("num");
//回転数
var rotate = document.getElementById("rotate");
//当たり数
var jackpot = document.getElementById("jackpot");
//回転数のカウント
var rotateCont = 0;
//当たった数のカウント
var jackpotCont = 0;
//演出用カウント
var lotteryCont = 0;

//その他表示場所
var other = document.getElementById("other");

//回っているかの判定
var isSpin = false

//当たりかどうか
var isJackpot = false;

//リーチの数
var reachNum = 0;

var obniz = new Obniz("YOUR_OBNIZ_ID");
var red = 0;
var green = 0;
var blue = 0;


obniz.onconnect = async function () {

    //回っているかの判定
    var isSpin = false

    //ブザーの設定
    var speaker = obniz.wired("Keyestudio_Buzzer", { signal: 0, vcc: 1, gnd: 2 });
    var led = obniz.wired("WS2811", { gnd: 8, vcc: 9, din: 10 });


 
    //スイッチの状態監視
    obniz.switch.onchange = function (state) {
        if (!isSpin) {
            //もし回転中じゃなかったら回転中にする
            isSpin = !isSpin;
            //回転数を増やし、表示を更新
            whiteLight();
            otherReset()
            reset();
            rotateUp();
            other.textContent = ""
            startSpin();
            selectJackpot();
            if (isJackpot) {
                selectJackpotLottery()
            } else {
                selectMissLottery()
            }
        }

    };


    function reset() {
        lotteryCont = 0;
        for (var i = 0; i < numElements.length; i++) {
            numElements[i].style.color = "black"
        }
    }

    //回転数を上げる
    function rotateUp() {
        rotateCont++;
        rotate.textContent = "回転数:" + rotateCont;
    }

    //回転スタート
    function startSpin() {
        console.log("スタートスピン開始")
        leftTimer = setInterval(() => {
            numElements[0].textContent = getIntRandom(9);
        }, 50);
        rightTimer = setInterval(() => {
            numElements[2].textContent = getIntRandom(9);
        }, 50);
        centerTimer = setInterval(() => {
            numElements[1].textContent = getIntRandom(9);
        }, 50);
    }





    //当たりかどうかの判定
    function selectJackpot() {
        console.log("セレクトジャックポット開始")
        var select = getIntRandom(319);
        if (select == 1) {
            isJackpot = true;
        } else {
            isJackpot = false;
        }
    }


    //当たり時の演出設定
    function selectJackpotLottery() {
        reachNum = getIntRandom(9);
        let lightNum = getIntRandom(300);
        if (lightNum < 240) {
            redLight();
        } else if (lightNum < 270) {
            greenLight();
        } else if (lightNum < 290) {
            blueLight();
        }
        console.log("セレクトジャックポット演出開始")
        if (getIntRandom(10000) == 1) {
            console.log("前回店")
            fullSpin();
        } else if (getIntRandom(100) == 1) {
            console.log("びた")
            bita();
        } else if (getIntRandom(0) == 1) {
            console.log("リーチ当たり")
            jackpotReach()

        } else {
            console.log("そのた")
        }

    }



    function selectMissLottery() {
        console.log("外れ演出決定")
        if (getIntRandom(30) == 1) {
            let lightNum = getIntRandom(300);
            if (lightNum > 290) {
                redLight();
            } else if (lightNum > 270) {
                greenLight();
            } else if (lightNum > 240) {
                blueLight();
            }
            missReach();
        } else {
            console.log("外れ")
            stopNormalSide(1000);
        }
    }

    //ランダムな整数値取得
    function getIntRandom(num) {
        return Math.floor(Math.random() * num) + 1;
    }


    function missReach() {
        console.log("外れリーチ")
        let color = "black"

        if (getIntRandom(5) == 1) {
            color = "blue"
        } else if (getIntRandom(7) == 1) {
            color = "green"
        } else if (getIntRandom(10) == 1) {
            color = "red"
        }
        changeNumsFontColor(color)
        do {
            reachNum = getIntRandom(9);
        } while (reachNum == 7);
        stopReachSide(1000);
        stopMissCenter(1000);
    }


    function jackpotReach() {
        console.log("当たりリーチ")
        let color = "red"

        if (getIntRandom(30) == 1) {
            color = "black"
        } else if (getIntRandom(20) == 1) {
            color = "blue"
        } else if (getIntRandom(10) == 1) {
            color = "green"
        }
        changeNumsFontColor(color)
        do {
            reachNum = getIntRandom(9);
        } while (reachNum == 7);
        stopReachSide(1000);
        stopJackpotCenter(1000)
    }

    //左右を止める(通常)
    function stopNormalSide(msecond) {
        console.log("左右どめ通常")
        setTimeout(() => {
            clearInterval(leftTimer);

        }, msecond);
        setTimeout(() => {
            clearInterval(rightTimer);
            if (numElements[0].textContent == numElements[2].textContent) {
                var rightNum = 0
                do {
                    rightNum = getIntRandom(9);
                } while (numElements[0].textContent == rightNum);
                numElements[2].textContent = rightNum
            }
            stopNormalCenter(500);
        }, msecond + 400);
    }

    //左右を止める(リーチ)
    function stopReachSide(msecond) {
        console.log("リーチ左右ストップ開始")
        setTimeout(() => {
            clearInterval(leftTimer);
            numElements[0].textContent = reachNum
        }, msecond);
        setTimeout(() => {
            clearInterval(rightTimer);
            numElements[2].textContent = reachNum
        }, msecond + 400);
    }


    //中を止める(通常)5
    function stopNormalCenter(msecond) {
        console.log("なかどめ通常")
        setTimeout(() => {
            clearInterval(centerTimer);
            isSpin = !isSpin;
        }, msecond);
    }

    //中を止める(リーチ外れ)12
    function stopMissCenter(msecond) {
        console.log("リーチなかどめ外れ")
        setTimeout(() => {
            clearInterval(centerTimer)
            other.textContent = "リーチ"
            centerTimer = setInterval(() => {
                countupNumber(1)
                if (lotteryCont > 5 && numElements[1].textContent == (parseInt(numElements[0].textContent)) % 9 + 1) {
                    clearInterval(centerTimer)
                    other.textContent = ""
                    isSpin = false;
                    changeNumsFontColor("black")
                }
            }, msecond);
        }, msecond + 800);
    }


    //中を止める(リーチ当たり)12
    function stopJackpotCenter(msecond) {
        console.log("リーチなかどめ当たり")
        setTimeout(() => {
            clearInterval(centerTimer)
            other.textContent = "リーチ"
            centerTimer = setInterval(() => {
                countupNumber(1)
                if (lotteryCont > 5 && numElements[1].textContent == (parseInt(numElements[0].textContent)) ) {
                    clearInterval(centerTimer)
                    isSpin = false;
                    changeNumsFontColor("black")
                    updateJackpot();
                    other.textContent = "あたり"
                }
            }, msecond);
        }, msecond + 800);
    }

    //中を止める(リーチ当たり)
    function stopBitaJackpotCenter(msecond) {
        console.log("リーチなかどめ当たり")
        setTimeout(() => {
            clearInterval(centerTimer)
            numElements[1].textContent = reachNum
            updateJackpot();
            other.textContent = "あたり"
            isSpin = false
        }, msecond);
    }


    function changeNumsFontColor(colorName) {
        console.log("文字色変更:" + colorName)
        for (var i = 0; i < numElements.length; i++) {
            numElements[i].style.color = colorName
        }
    }







    //その他リセット
    function otherReset() {
        console.log("その他リセット")
        other.textContent = ""
    }


    //カウントアップ
    function countupNumber(index) {
        console.log("カウントアップ")

        var num = parseInt(numElements[index].textContent);

        num = (((num) % 9) + 1)
        console.log(num)
        numElements[index].textContent = num;
        lotteryCont++;

    }


    //全回転
    function fullSpin() {
        reachNum = 7;
        setTimeout(() => {
            console.log("前回店")
            clearInterval(leftTimer);
            clearInterval(centerTimer);
            clearInterval(rightTimer);
            numElements[0].textContent = reachNum;
            numElements[1].textContent = reachNum;
            numElements[2].textContent = reachNum;

            leftTimer = setInterval(() => {
                countupNumber(0);
            }, 1000);
            rightTimer = setInterval(() => {
                countupNumber(1);
            }, 1000);
            centerTimer = setInterval(() => {
                countupNumber(2);
            }, 1000);

            let html = document.getElementById("html");
            html.style.backgroundColor = "black"
            other.textContent = "おめでとう"
            let colorNum = 0;
            let timeCount = -30
            changeWhite = setInterval(() => {
                if (colorNum > 255) {
                    colorNum == 255;
                }
                html.style.backgroundColor = "rgb(" + colorNum + "," + colorNum + "," + colorNum + ")";
                if (timeCount > 0) {
                    colorNum += 1;
                }
                timeCount++;
            }, 30)
            setTimeout(() => {
                clearInterval(leftTimer);
                clearInterval(centerTimer);
                clearInterval(rightTimer);
                clearInterval(changeWhite);
                updateJackpot()
                html.style.backgroundColor = "white"
                other.textContent = "おめでとう"
                isSpin = false;
            }, 9000)
        }, 3000)

    }

    function bita() {
        console.log("びた開始")
        stopReachSide(1000)
        stopBitaJackpotCenter(1000);
    }

    function updateJackpot() {
        console.log("あぷでーとジャックポット")
        jackpotCont++
        sinfo();
        let lightTimer = setInterval(() => {
            jackpotLight()
        }, 100)
        setTimeout(() => {
            clearInterval(lightTimer)
            whiteLight();

        }, 5000)
        jackpot.textContent = "あたり:" + jackpotCont
    }


    async function testMusic() {
        so();
        await obniz.wait(vis);
        doo();

    }
    // キーボードイベントリスナー (キーアップ) を追加
    async function sinfo() {
        so();
        await obniz.wait(vis);
        await obniz.wait(vis);
        doo();
        await obniz.wait(vis);
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        re();
        await obniz.wait(vis);
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        mi_b();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        mi_b();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        mi_b();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        mi_b();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        mi_b();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        mi_b();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        so();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        so();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        so();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        so();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        so();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        so();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        re();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        re();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        re();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        re();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        re();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        re();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        shi_b();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        shi_b();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        shi_b();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        shi_b();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        shi_b();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        shi_b();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        doo();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        doo();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        doo();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        doo();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        doo();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        doo();
        await obniz.wait(vis);
        speaker.stop();
        await obniz.wait(aida);
        doo();
        await obniz.wait(1500);

        speaker.stop();
    }




    async function jackpotLight() {
        red += Math.floor(Math.random() * 10)
        green += Math.floor(Math.random() * 10)
        blue += Math.floor(Math.random() * 10)
        red = red % 256;
        green = green % 256;
        blue = blue % 256;
        led.rgb(red, green, blue); // Yellow
    }

    function normalLight() {

        led.rgb(getIntRandom(0), getIntRandom(0), getIntRandom(0));
    }
    function whiteLight() {
        console.log("ライト白")
        led.rgb(255, 255, 255);
    }


    function blueLight() {
        console.log("ライト青")

        led.rgb(0, 0, 255);
    }

    function redLight() {
        console.log("ライト赤")

        led.rgb(255, 0, 0);
    }
    function greenLight() {
        console.log("ライト緑")

        led.rgb(0, 255, 0);
    }


    function so() {
        speaker.play(783.991);
    }
    function shi_b() {
        speaker.play(932.328);
    }
    function doo() {
        speaker.play(1046.502);
    }

    function re() {
        speaker.play(1174.659);
    }

    function mi_b() {
        speaker.play(1244.508);
    }

}
