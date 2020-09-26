import Dexie from "dexie";
import { Define } from "./define";

const DB_NAME = "bnandb1";

export class AppDatabase extends Dexie {
  docs: Dexie.Table<IDoc, number>;
  contents: Dexie.Table<IContents, number>;

  constructor() {
    super(DB_NAME);

    this.version(2).stores({
      docs: "++id, title, dt",
      contents: "[docId+ver+seq], [docId+ver], docId",
    });

    this.docs = this.table("docs");
    this.contents = this.table("contents");
  }

  async loadSample() {
    //console.log("***AppDatabase.loadSample");
    try {
      // サンプル文書を登録
      let doc = new Doc(
        "サンプル文書", // title
        0, // ver
        Define.MODE_V, // vertical
        20, // fontSize
        -1, // current
        AppDatabase.getDt(), // dt
        "" // json
      );

      this.docs.add(doc).then((id) => {
        doc.id = id;

        let text = `※ この文書は、/このアプリで入力するテキストの入力方法を説明するためのサンプル文書です。/不要になったら、/削除してください。/

「目次」を押して、/各ページに移動してください。/
「更新・変更する」ボタンを押すと、/この文書の元になったテキストが表示されます。/テキストを変更したり、/横書き／縦書き、フォントサイズを変えたりしてみてください。/

# 表記方法
このアプリ用の特殊な表記のルールを以下に記述します。/

■ 区切り/
文中に「//」(スラッシュ)を入力すると、/文書表示画面で黒塗り表示した際に、/その位置が黒塗りの区切りとなります。/

例：/
  カムパネルラが手をあげました。//それから四、五人手をあげました。//

と入力すると、/黒塗りの区切りが「//」の位置になります。/
「//」は区切り文字として認識され、/文書表示画面には表示されません。/スラッシュを表示させたい場合は、/「////」と２つ続けて入力すると、/１つのスラッシュが表示されます。/

■ 見出し/
見出しをつけるには、/行頭に「#」記号を付けます。/見出しは６段階まで設定することができます。/見出しをつけると、/文書の区切りとなり、/目次に表示されます。/見出しは、/文書表示画面で黒塗り表示されません。/
  # 見出し1
  ## 見出し2
  ### 見出し3
  #### 見出し4
  ##### 見出し5
  ###### 見出し6

■ ルビ
漢字にルビ（ふりがな）を振るには、/漢字の次に「《《」を入力してルビを入力し、/その次に「》》」を入力します。/

例：/
  宮沢《《みやざわ》》賢治《《けんじ》》
と入力すると、/
  宮沢《みやざわ》賢治《けんじ》
と表示されます。/

漢字が続いている箇所でルビを振る文字を限定するには、/限定する箇所の前に、/「｜｜」（全角縦棒）または「||」（半角縦棒）を入力します。/

例：/
  石川｜｜啄木《《たくぼく》》
と入力すると、/
  石川｜啄木《たくぼく》
と表示されます。/

「《《」、「》》」、「｜｜」、「||」は制御用の文字として認識され、/文書表示画面には表示されません。/これらを表示させたい場合は、/２つ続けて「《《《《」、「》》》》」、「｜｜｜｜」、「||||」と入力すると、/１つ表示されます。/

■ 中寄せ/
行頭に「《《》》」があれば、その行は中寄せとなります。/

例：/
  《《》》 中寄せ
と入力すると、/
《》 中寄せ
と表示されます。/

■ 右寄せ、下寄せ/
行頭に「》》」があれば、/その行は、/横書き表示なら右寄せ、/縦書き表示なら下寄せとなります。/

例：/
  》》右寄せ
と入力すると、/
》右寄せ
と表示されます。/

# 銀河鉄道《ぎんがてつどう》の夜
》宮沢《みやざわ》賢治《けんじ》/
## 午後の授業
※ 「黒塗り」ボタンを押してみてください。/

「ではみなさんは、/そういうふうに川だと言《い》われたり、/乳《ちち》の流《なが》れたあとだと言《い》われたりしていた、/このぼんやりと白いものが/ほんとうは何かご承知《しょうち》ですか」/先生は、/黒板《こくばん》につるした大きな黒い星座《せいざ》の図の、/上から下へ白くけぶった銀河帯《ぎんがたい》のようなところを指《さ》しながら、/みんなに問《と》いをかけました。/
　カムパネルラが手をあげました。/それから四、五人手をあげました。/ジョバンニも手をあげようとして、/急《いそ》いでそのままやめました。/たしかにあれがみんな星だと、/いつか雑誌《ざっし》で読んだのでしたが、/このごろはジョバンニはまるで毎日教室でもねむく、/本を読むひまも読む本もないので、/なんだかどんなこともよくわからないという気持《きも》ちがするのでした。/
（以下略）`;

        const lines = text.split("\n");
        let seq = 0;
        let con: Contents = null;

        for (let l of lines) {
          con = new Contents(doc.id, 0, seq, l);
          this.contents.add(con);
          seq++;
        }
      });

      /*
      // テスト用
      doc = new Doc(
        "銀河鉄道の夜", // title
        0, // ver
        Define.MODE_V, // vertical
        20, // fontSize
        -1, // current
        AppDatabase.getDt(), // dt
        "" // json
      );

      this.docs.add(doc).then((id) => {
        doc.id = id;

        let text = `# 銀河鉄道《ぎんがてつどう》の夜
》宮沢《みやざわ》賢治《けんじ》/
## 午後の授業
「ではみなさんは、そういうふうに川だと言《い》われたり、乳《ちち》の流《なが》れたあとだと言《い》われたりしていた、このぼんやりと白いものがほんとうは何かご承知《しょうち》ですか」先生は、黒板《こくばん》につるした大きな黒い星座《せいざ》の図の、上から下へ白くけぶった銀河帯《ぎんがたい》のようなところを指《さ》しながら、みんなに問《と》いをかけました。
　カムパネルラが手をあげました。それから四、五人手をあげました。ジョバンニも手をあげようとして、急《いそ》いでそのままやめました。たしかにあれがみんな星だと、いつか雑誌《ざっし》で読んだのでしたが、このごろはジョバンニはまるで毎日教室でもねむく、本を読むひまも読む本もないので、なんだかどんなこともよくわからないという気持《きも》ちがするのでした。
　ところが先生は早くもそれを見つけたのでした。
「ジョバンニさん。あなたはわかっているのでしょう」
　ジョバンニは勢《いきお》いよく立ちあがりましたが、立ってみるともうはっきりとそれを答えることができないのでした。ザネリが前の席《せき》からふりかえって、ジョバンニを見てくすっとわらいました。ジョバンニはもうどぎまぎしてまっ赤になってしまいました。先生がまた言《い》いました。
「大きな望遠鏡《ぼうえんきょう》で銀河《ぎんが》をよっく調《しら》べると銀河《ぎんが》はだいたい何でしょう」
　やっぱり星だとジョバンニは思いましたが、こんどもすぐに答えることができませんでした。
　先生はしばらく困《こま》ったようすでしたが、眼《め》をカムパネルラの方へ向《む》けて、
「ではカムパネルラさん」と名指《なざ》しました。
　するとあんなに元気に手をあげたカムパネルラが、やはりもじもじ立ち上がったままやはり答えができませんでした。
　先生は意外《いがい》なようにしばらくじっとカムパネルラを見ていましたが、急《いそ》いで、
「では、よし」と言《い》いながら、自分で星図を指《さ》しました。
「このぼんやりと白い銀河《ぎんが》を大きないい望遠鏡《ぼうえんきょう》で見ますと、もうたくさんの小さな星に見えるのです。ジョバンニさんそうでしょう」
　ジョバンニはまっ赤《か》になってうなずきました。けれどもいつかジョバンニの眼《め》のなかには涙《なみだ》がいっぱいになりました。そうだ僕《ぼく》は知っていたのだ、もちろんカムパネルラも知っている、それはいつかカムパネルラのお父さんの博士《はかせ》のうちでカムパネルラといっしょに読んだ雑誌《ざっし》のなかにあったのだ。それどこでなくカムパネルラは、その雑誌《ざっし》を読むと、すぐお父さんの書斎《しょさい》から巨《おお》きな本をもってきて、ぎんがというところをひろげ、まっ黒な頁《ページ》いっぱいに白に点々《てんてん》のある美《うつく》しい写真《しゃしん》を二人でいつまでも見たのでした。それをカムパネルラが忘《わす》れるはずもなかったのに、すぐに返事《へんじ》をしなかったのは、このごろぼくが、朝にも午後にも仕事《しごと》がつらく、学校に出てももうみんなともはきはき遊《あそ》ばず、カムパネルラともあんまり物を言《い》わないようになったので、カムパネルラがそれを知ってきのどくがってわざと返事《へんじ》をしなかったのだ、そう考えるとたまらないほど、じぶんもカムパネルラもあわれなような気がするのでした。
　先生はまた言《い》いました。
「ですからもしもこの天の川がほんとうに川だと考えるなら、その一つ一つの小さな星はみんなその川のそこの砂《すな》や砂利《じゃり》の粒《つぶ》にもあたるわけです。またこれを巨《おお》きな乳《ちち》の流《なが》れと考えるなら、もっと天の川とよく似《に》ています。つまりその星はみな、乳《ちち》のなかにまるで細《こま》かにうかんでいる脂油《あぶら》の球《たま》にもあたるのです。そんなら何がその川の水にあたるかと言《い》いますと、それは真空《しんくう》という光をある速《はや》さで伝《つた》えるもので、太陽《たいよう》や地球《ちきゅう》もやっぱりそのなかに浮《う》かんでいるのです。つまりは私《わたし》どもも天の川の水のなかに棲《す》んでいるわけです。そしてその天の川の水のなかから四方を見ると、ちょうど水が深いほど青く見えるように、天の川の底《そこ》の深《ふか》く遠いところほど星がたくさん集まって見え、したがって白くぼんやり見えるのです。この模型《もけい》をごらんなさい」
　先生は中にたくさん光る砂《すな》のつぶのはいった大きな両面《りょうめん》の凸《とつ》レンズを指《さ》しました。
「天の川の形はちょうどこんななのです。このいちいちの光るつぶがみんな私《わたし》どもの太陽《たいよう》と同じようにじぶんで光っている星だと考えます。私どもの太陽《たいよう》がこのほぼ中ごろにあって地球《ちきゅう》がそのすぐ近くにあるとします。みなさんは夜にこのまん中に立ってこのレンズの中を見まわすとしてごらんなさい。こっちの方はレンズが薄《うす》いのでわずかの光る粒《つぶ》すなわち星しか見えないでしょう。こっちやこっちの方はガラスが厚《あつ》いので、光る粒《つぶ》すなわち星がたくさん見えその遠いのはぼうっと白く見えるという、これがつまり今日の銀河《ぎんが》の説《せつ》なのです。そんならこのレンズの大きさがどれくらいあるか、またその中のさまざまの星についてはもう時間ですから、この次《つぎ》の理科の時間にお話します。では今日はその銀河《ぎんが》のお祭《まつ》りなのですから、みなさんは外へでてよくそらをごらんなさい。ではここまでです。本やノートをおしまいなさい」
　そして教室じゅうはしばらく机《つくえ》の蓋《ふた》をあけたりしめたり本を重《かさ》ねたりする音がいっぱいでしたが、まもなくみんなはきちんと立って礼《れい》をすると教室を出ました。`;

        const lines = text.split("\n");
        let seq = 0;
        let con: Contents = null;

        for (let l of lines) {
          con = new Contents(doc.id, 0, seq, l);
          this.contents.add(con);
          seq++;
        }
      });

      doc = new Doc(
        "レ・ミゼラブル", // title
        0, // ver
        Define.MODE_H, // horizontal
        20, // fontSize
        -1, // current
        AppDatabase.getDt(), // dt
        "" // json
      );

      this.docs.add(doc).then((id) => {
        doc.id = id;

        let text = `　一七八九年七月バスティーユ牢獄の破壊にその端緒を開いたフランス大革命は、有史以来人類のなした最も大きな歩みの一つであった。その叫喊《きょうかん》は生まれいずる者の産声《うぶごえ》であり、その恐怖は新しき太陽に対する眩惑《げんわく》であり、その血潮は新たに生まれいでた赤児の産湯《うぶゆ》であった。そしてその赤児を育つるに偉大なる保母がなければならなかった。一挙にして共和制をくつがえして帝国を建て、民衆の声に代うるに皇帝の命令をもってし、全ヨーロッパ大陸に威令したナポレオンは、実に自ら知らずしてかの赤児の保母であった、偉人の痛ましき運命の矛盾である。帝国の名のもとに赤児はおもむろに育って行った。やがて彼が青年に達するとき、その保母にはワーテルローがなければならなくなった。
「自由」とナポレオン、外観上相反するその二つは、実は一体の神に祭らるべき運命にあった。フランスの民衆はその前に跪拝《きはい》した。彼らのうちにおいてその二つは、あるいは矛盾し、あるいは一致しながら、常に汪洋《おうよう》たる潮の流れを支持していた。そして彼らの周囲には、古き世界の伝統があった。伝統に対する奉仕者らが、神聖同盟の強力が。けれども彼らの心の奥には、パリーの裏長屋の片すみには、「自由」とナポレオンの一体の神が常に祭られていた。一八三〇年七月の革命は、また一八三二年六月の暴動は、底に潜んだ潮の流れの、表面に表われた一つの波濤《はとう》にすぎなかった。
　その動揺せる世潮の中を、一人の男が、惨《みじ》めなるかつ偉大なる一人の男が、進んでゆく。身には社会的永罰を被りながら、周囲には社会の下積みたる浮浪階級を持ちながら、彼はすべてを避けず、すべてに忍従しつつ進んでゆく。彼の名をジャン・ヴァルジャンと言う。
　ジャン・ヴァルジャンは片田舎《かたいなか》の愚昧《ぐまい》なる一青年であった。彼は一片のパンを盗んだために、ついに十九年間の牢獄生活を送らねばならなかった。十九年の屈辱と労役とのうちに、彼は知力とまた社会に対する怨恨《えんこん》とを得た。そして獄を出ると、彼が第一に出会ったものは、すべてを神に捧《ささ》げつくしたミリエル司教であった。そこに彼の第一の苦悶《くもん》が生まれる。神と悪魔との戦いである。苦悶のうちに少年ジェルヴェーについての試練がきた。彼は勇ましくも贖罪《しょくざい》の生活にはいり、マドレーヌなる名のもとに姿を隠して、モントルイュ・スュール・メールの小都市において事業と徳行とに成功し、ついに市長の地位を得た。しかし彼の前名を負って重罪裁判に付せられたシャンマティユーの事件が起こった。そこに彼の第二の苦悶が生まれる。良心と誘惑との戦いである。彼は自ら名乗って出て、再び牢獄の生活が始まった。しかし彼は巧みに獄を脱して、不幸なる女ファンティーヌへの生前の誓いを守って、彼女の憐《あわ》れなる娘コゼットを無頼の者の手より取り返し、彼女を伴なってパリーの暗黒のうちに身を隠した。そしてそこにおいてあらゆる事変は渦を巻いて彼を取り囲んだ。警官の追跡、女修道院の生活、墓穴への冒険、浮浪少年の群れ、熱情のマリユス、無為のマブーフ老人、ＡＢＣの秘密結社、ゴルボー屋敷、無頼なるテナルディエの者ども、少年ガヴローシュ、マリユスとコゼットの恋、一八三二年六月の暴動、市街戦、革命児アンジョーラ、下水道中の逃走、ジャヴェルの自殺、マリユスとコゼットとの結婚、ジャン・ヴァルジャンの告白。そこに彼の第三の苦悶が生まれる。この世の有と無との戦いである。すべてを失った後、彼は死と微光との前に立つ。マリユスとコゼットとに向かって彼は言う、「……お前たちは祝福された人たちだ。私はもう自分で自分がよくわからない。光が見える。もっと近くにおいで。私は楽しく死ねる。お前たちのかわいい頭をかして、その上にこの手を置かして下さい。」かくしてパリーの墓地の片すみの叢《くさむら》の中に、一基の無銘の石碑が建った。
　何故に無銘であったか？　それは実に「永劫《えいごう》の社会的処罰」を受けた者の墓碑であったからである。一度｜深淵《しんえん》の底に沈んだ彼は、再び水面に上がることは、いかなる善行をもってしてもこの世においてはできなかったのである。いや不幸なのは彼のみではなかった。種々の原因のもとに「社会的窒息」を遂げた多くの者がそこにはいた。ファンティーヌ、テナルディエ、エポニーヌ、アゼルマ、アンジョーラ、ガヴローシュ、そしてまたある意味においてジャヴェル、その他多くの者が。ただこの世において救われた者は、マリユスとコゼットのみであった。なぜであるか？　彼らまでも破滅の淵《ふち》に陥ったならば、この物語はあまりに悲惨であったろうから。さはあれ、それらももはや一つの泡沫《ほうまつ》にすぎなかったのである。大革命とナポレオンとの二つの峰を有する世潮にすべてのものを押し流し、民衆はその無解決の流れのうちに喘《あえ》いでいた。ゆえに、ワーテルローの戦いと、王政復古と、一八三二年の暴動と、社会の最下層と、パリーの市街の下の下水道とが、詳細に述べられなければならなかったのである。`;

        const lines = text.split("\n");
        let seq = 0;
        let con: Contents = null;

        for (let l of lines) {
          con = new Contents(doc.id, 0, seq, l);
          this.contents.add(con);
          seq++;
        }
      });

      doc = new Doc(
        "妙法蓮華経", // title
        0, // ver
        Define.MODE_V, // vertical
        20, // fontSize
        -1, // current
        AppDatabase.getDt(), // dt
        "" // json
      );

      this.docs.add(doc).then((id) => {
        doc.id = id;

        let text = `※ この文書は、`;

        const lines = text.split("\n");
        let seq = 0;
        let con: Contents = null;

        for (let l of lines) {
          con = new Contents(doc.id, 0, seq, l);
          this.contents.add(con);
          seq++;
        }
      });

      doc = new Doc(
        "三世諸仏総勘文教相廃立", // title
        0, // ver
        Define.MODE_V, // vertical
        20, // fontSize
        -1, // current
        AppDatabase.getDt(), // dt
        "" // json
      );

      this.docs.add(doc).then((id) => {
        doc.id = id;

        let text = `※ この文書は、`;

        const lines = text.split("\n");
        let seq = 0;
        let con: Contents = null;

        for (let l of lines) {
          con = new Contents(doc.id, 0, seq, l);
          this.contents.add(con);
          seq++;
        }
      });

      doc = new Doc(
        "日本史年表", // title
        0, // ver
        Define.MODE_H, // horizontal
        16, // fontSize
        -1, // current
        AppDatabase.getDt(), // dt
        "" // json
      );

      this.docs.add(doc).then((id) => {
        doc.id = id;

        let text = `本能寺の変/
》1582年/
九州の少年使節渡欧（～1590年）/
》1582年/
太閤検地（～1598年）/
》1582年/
小牧・長久手の戦い/
》1584年/
豊臣秀吉が関白になる/
》1585年/
豊臣秀吉が紀伊根来・雑賀の一揆を討つ/
》1585年/
秀吉が刀狩令を発する/
》1588年/
豊臣秀吉が全国統一/
》1590年/
豊臣秀吉が戸口調査を実施/
》1591年/
文禄の役/
》1592年/
豊臣秀吉が朱印船制度を定める/
》1592年/
慶長の役/
》1597年/
関ヶ原の戦い/
》1600年/
伏見に銀座を置き、/慶長金銀を鋳造/
》1601年/
徳川家康が江戸幕府を開く/
》1603年/
江戸幕府が正式に朱印船貿易をはじめる/
》1604年/
煙草が流行する/
》1605年/
徳川義直を尾張に封ず（尾張家）/
》1607年/
徳川家康が駿府に移る/
》1607年/
徳川頼房を水戸に封ず（水戸家）/
》1609年/
西国の大名の人質を江戸に集める/
》1609年/
煙草を禁止する/
》1609年/
足尾銅山を発見/
》1610年/
岡本大八を処刑（禁教の発端となる）/
》1612年/
大阪冬の陣/
》1614年/
朝鮮活字で大蔵経を印刷/
》1614年/
大阪夏の陣→豊臣氏が滅びる/
》1615年/
武家諸法度・禁中並公家諸法度が公布される/
》1615年/
欧船の来航を長崎の平戸に制限する/
》1616年/
煙草の栽培を禁止/
》1616年/
人身売買を禁止する/
》1616年/
江戸吉原遊郭の開設を許す/
》1617年/
徳川頼宣を紀伊に封ず（紀伊家）/
》1619年/`;

        const lines = text.split("\n");
        let seq = 0;
        let con: Contents = null;

        for (let l of lines) {
          con = new Contents(doc.id, 0, seq, l);
          this.contents.add(con);
          seq++;
        }
      });
      */
    } catch (e) {
      throw Error("AppDatabase.loadSample error: " + e);
    }
  }

  static async deleteDb() {
    try {
      await Dexie.delete(DB_NAME);
    } catch (e) {}
  }

  static getDt(): string {
    let date = new Date();
    let dt =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2) +
      ("00" + date.getMilliseconds()).slice(-3);
    return dt;
  }
}

export interface IDoc {
  id?: number;
  title: string;
  ver: number; // バージョン
  vertical: number; // 1:横書き, 2:縦書き
  fontSize: number;
  current: number;
  dt: string;
  json: string; // 予備（現在は不使用）
}

export interface IContents {
  docId: number;
  ver: number;
  seq: number;
  text: string;
}

export class Doc implements IDoc {
  id: number;
  title: string;
  ver: number;
  vertical: number;
  fontSize: number;
  current: number;
  dt: string;
  json: string;

  constructor(
    title: string,
    ver: number,
    vertical: number,
    fontSize: number,
    current: number,
    dt: string,
    json: string,
    id?: number
  ) {
    this.title = title;
    this.ver = ver;
    this.vertical = vertical;
    this.fontSize = fontSize;
    this.current = current;
    this.dt = dt;
    this.json = json;
    if (id) this.id = id;
  }

  toString(): string {
    return (
      "Doc [id:" +
      this.id +
      ", title:" +
      this.title +
      ", ver:" +
      this.ver +
      ", vertical:" +
      this.vertical +
      ", fontSize:" +
      this.fontSize +
      ", current:" +
      this.current +
      ", dt:" +
      this.dt +
      "]"
    );
  }
}

export class Contents implements IContents {
  docId: number;
  ver: number;
  seq: number;
  text: string;

  constructor(docId: number, ver: number, seq: number, text: string) {
    this.docId = docId;
    this.ver = ver;
    this.seq = seq;
    this.text = text;
  }

  toString(): string {
    return (
      "Contents [id:" +
      ", docId:" +
      this.docId +
      ", ver:" +
      this.ver +
      ", seq:" +
      this.seq +
      ", text:" +
      this.text +
      "]"
    );
  }
}