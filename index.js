import express from "express";
import process from "process";
import axios from "axios";

const app = express();

const rakuten = async () => {
    var args = [
        20,
        30,
        40
    ]
    var age = args[Math.floor(Math.random() * args.length)];
    var random = Math.floor(Math.random() * 34) + 1;
    var requestUrl = "https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20220601?applicationId=" + process.env.RAKUTEN_APP_ID
        + "&age=" + age + "&sex=1&carrier=0&page=" + random + "&affiliateId=" + process.env.RAKUTEN_AFFILIATE_ID;
    console.log(requestUrl);
    await axios.get(requestUrl, {
    }).then((response) => {
        if (response.status !== 201) {
            var randomNo = Math.floor(Math.random() * (response.data.Items.length));
            var itemName = response.data.Items[randomNo].Item.itemName;
            var catchcopy = response.data.Items[randomNo].Item.catchcopy;
            var affiliateUrl = response.data.Items[randomNo].Item.affiliateUrl;
            console.log(itemName);
            console.log(catchcopy);
            console.log(affiliateUrl);
            var text = itemName + catchcopy;
            console.log(text);
            var tweetText = text.substring(0, 90) + " " + affiliateUrl + " #楽天ROOM #楽天 #楽天市場 #ad #PR";
            return tweetText;
        }
    }).catch((error) => {
        console.log(error);
        return;
    });

};


app.get("/rakuten", async (req, res, next) => {
    try {
        var data = await rakuten();
        console.log(data);
        var response = {
            tweetText:data
          }
          res.send(JSON.stringify(response));
    } catch (err) {
        console.log(err);
        next(err);
        res.send('エラー');
    }
});



app.get("/", (req, res) => {
    try {
        console.log("ログ定期実行")
    } catch (err) {
        console.log(err);
    }
    res.send('get');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);