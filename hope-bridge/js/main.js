/* =====================================================================
   ★ 編集エリア：ここから下を書き換えてください
   ・文章は " " の中を書き換えるだけ
   ・行（{ ... }, や "...",）を増やす／消すと、カードや項目も増減します
   ・写真は image: "" にファイル名かURL。空欄なら仮の枠が出ます
   ・リンク先（url）が空欄のボタンは、LINEのURLにつながります
   ===================================================================== */
const CONFIG = {

  /* --- ユリの挿絵（show:false で全部消えます／opacity は 0〜1 で濃さ） --- */
  decor: { show: true, opacity: 0.45, chara: true, writing: true },   // chara:false でキャラクター、writing:false で見出しの手書きアニメを非表示

  /* --- 基本情報 --- */
  brand: {
    name: "Hope Bridge Design",
    shortName: "HOPE BRIDGE",            // ヘッダーのロゴ
    tagline: "イラスト・動画・デザイン・Web制作",
    area: "北海道・札幌",
    representative: "りーたん",
    lineUrl: "https://lin.ee/7NSN6RL",     // LINE公式アカウント
    instagramId: "",                      // @なし。空欄なら非表示
    instagramUrl: ""
  },

  /* --- メニュー（ページ）。href を変えるとリンク先が変わります --- */
  nav: [
    { href:"service.html", page:"service", ja:"制作メニュー", en:"SERVICE" },
    { href:"works.html",   page:"works",   ja:"制作実績",     en:"WORKS" },
    { href:"price.html",   page:"price",   ja:"料金",         en:"PRICE" },
    { href:"connect.html", page:"connect", ja:"つながる活動", en:"CONNECT" },
    { href:"about.html",   page:"about",   ja:"りーたんについて", en:"ABOUT" }
  ],

  /* --- 下層ページの見出し --- */
  pages: {
    service: { en:"SERVICE", title:"制作メニュー", lead:"手描き動画・LINEスタンプ・似顔絵・名刺・Web・動画編集まで。ひとつからでも、まとめてでもご相談いただけます。" },
    works:   { en:"WORKS",   title:"制作実績",     lead:"手描き動画・似顔絵・LINEスタンプの一部をご紹介します。" },
    price:   { en:"PRICE",   title:"料金のめやす", lead:"はじめての方でも頼みやすいように、めやすの料金を載せています。" },
    connect: { en:"CONNECT", title:"つながる活動", lead:"人と人、仕事とチャンスをつなぐ活動をしています。" },
    about:   { en:"ABOUT",   title:"りーたんについて", lead:"Hope Bridge Design の想いと、りーたんのこと。" },
    privacy: { en:"PRIVACY POLICY", title:"プライバシーポリシー", lead:"お預かりする情報の取り扱いについて" }
  },

  /* --- トップページの案内カード --- */
  digest: {
    title: "知りたいところから、\nどうぞ。",
    lead: "くわしい内容は、それぞれのページにまとめています。",
    items: [
      { href:"service.html", image:"@sv_movie",   en:"SERVICE", title:"制作メニュー",   text:"手描き動画・スタンプ・似顔絵・名刺・Webなど9種類。" },
      { href:"works.html",   image:"@il1",        en:"WORKS",   title:"制作実績",       text:"動画・似顔絵・LINEスタンプの作品を見る。" },
      { href:"price.html",   image:"@sv_sticker", en:"PRICE",   title:"料金のめやす",   text:"似顔絵 3,000円〜、スタンプ 16,000円〜ほか。" },
      { href:"connect.html", image:"@dc2",        en:"CONNECT", title:"つながる活動",   text:"お繋ぎ・マルシェ・販路・スクールのご案内。" },
      { href:"about.html",   image:"@pf",         en:"ABOUT",   title:"りーたんについて", text:"想いを見つけ、伝わる形に変えるクリエイター。" }
    ]
  },
  /* --- ファーストビュー --- */
  hero: {
    kicker: "イラスト・動画・デザイン・Web制作",
    titleLine1: "あなたの\n「伝えたい」を、",
    titleLine2: "カタチに。",
    lead: "手描きの温かみを活かした動画やイラストから、ビジネスに役立つデザイン・Web制作まで。あなたらしい魅力を引き出し、伝えたい人に届くクリエイティブをお届けします。",
    /* トップ画像：ふわっと切り替わります（"@h1" は埋め込み済み。ファイル名やURLにも差し替え可） */
    slides: [
      { src:"@h1", alt:"Design 想いをカタチに。伝わるデザインで、あなたの魅力を届けます",
        caption:{ script:"Design", title:"想いをカタチに", text:"伝わるデザインで\nあなたの魅力を届けます" } },
      { src:"@h2", alt:"Connect 人と想いをつなぐ。地域・お店・人がつながる新しいカタチを応援します" },
      { src:"@h3", alt:"Create 伝えるを、もっと楽しく。手描き動画・イラストで、あなたの想いを見える化します" }
    ],
    wide: "@hw",                        // パソコンで画面いっぱいに出す横長の画像
    slideSeconds: 5,                    // 1枚あたりの表示秒数
    marquee: "HOPE BRIDGE DESIGN ・ ILLUSTRATION ・ MOVIE ・ DESIGN ・ WEB ・ "
  },

  /* --- ヒーローの相談ボックス／帯／下部バーで共通 --- */
  consult: {
    tag: "相談無料",
    text: "何を作るか決まっていなくても大丈夫です。",
    button: "LINEで無料相談する",
    band: "「こんなこともお願いできる？」から、どうぞ。",
    bandNote: "目的やご予算、ご希望をうかがいながら、何を作ればいいかを一緒に考えます。"
  },

  facts: [
    { label:"制作ジャンル", value:"9種類（まとめて依頼OK）" },
    { label:"強み",         value:"手描きの温かみ" },
    { label:"ご依頼",       value:"個人・店舗・企業" },
    { label:"ご相談",       value:"LINEで無料" }
  ],

  /* --- お悩み --- */
  concern: {
    title: "こんな想い、\nしまい込んでいませんか。",
    items: [
      "こんなものが作れたらいいな、と思っている",
      "自分のサービスを、もっと知ってもらいたい",
      "頭の中のイメージを、うまく形にできない",
      "誰に何を頼めばいいのか分からない",
      "名刺・チラシ・Webの雰囲気がバラバラになっている",
      "言葉だけでは、仕事への想いが伝わりきらない"
    ],
    philoLabel: "Hope Bridge Design の想い",
    philoTitle: "想いやお悩みに寄り添いながら、\n一緒に形にしていきます。",
    philoText: "あなたの中にある「伝えたい」は、まだ言葉になっていなくても大丈夫です。お話をうかがいながら魅力を引き出し、伝えたい人にきちんと届くカタチに整えます。"
  },

  /* --- プロフィール --- */
  profile: {
    en: "PROFILE",
    title: "伝えたい想いを、届く形へ。",
    image: "@pf",
    name: "りーたん",
    role: "想いを見つけ、伝わる形に変えるクリエイター",
    brand: "Hope Bridge Design",
    base: "北海道・札幌",
    intro: "Hope Bridge Designの、りーたんです。",
    story: [
      "私は、伝えたいことはあるけれど、うまく言葉にできない方の想いを聞き、Webデザイン・手描き動画・似顔絵・動画編集などを通して、その人らしく伝わる形に変えています。",
      "私自身、これまで多くの人に支えてもらった経験があるからこそ、今度は誰かの一歩を応援する側へ。"
    ],
    highlight: "受け取った優しさを次の誰かへつなぐ、\n希望の架け橋でありたいと考えています。",
    box: "制作して終わりではなく、\n「誰に、何を、どう届けたいのか」まで一緒に整理します。",
    closing: ["「何を頼めばいいか分からない」からでも大丈夫です。","あなたの想いを聞かせてください。","必要な人に届く形を、一緒につくります。"],
    button: "LINEで想いを話してみる",
    sign: "りーたん"
  },

  /* --- 制作できるもの（9種類） --- */
  services: {
    title: "制作できるもの",
    lead: "動画・イラスト・印刷物・Webまで。必要なものを、ひとつからでも、まとめてでもご相談いただけます。",
    items: [
      { en:"HAND-DRAWN MOVIE", title:"手描き動画制作", catch:"あなたの想いを、心に残るストーリーに。",
        text:"手描きイラストが動きながら物語を展開する、温かみのある動画です。商品やサービスの魅力、仕事への想い、これまでの人生など、言葉だけでは伝えきれない価値を分かりやすく表現します。",
        list:["企業・店舗PR動画","商品・サービス紹介動画","自己紹介・人生ストーリー動画","手描きアニメーションCM","セミナー・イベント紹介動画","説明・教育動画"], image:"@sv_movie" },
      { en:"LINE STICKER", title:"LINEスタンプ制作", catch:"あなたらしさを、毎日の会話に。",
        text:"オリジナルキャラクターや似顔絵を使ったLINEスタンプを制作します。個人で楽しむスタンプはもちろん、店舗や企業のキャラクターを活用したスタンプもご相談いただけます。",
        list:["オリジナルLINEスタンプ","似顔絵LINEスタンプ","店舗・企業向けLINEスタンプ","オリジナルキャラクター制作"], image:"@sv_sticker", slides:["@s_golf1","@s_ayu3","@s_pon1","@s_men2","@s_miki2","@s_ayu2","@s_golf2","@s_pon2","@s_men3","@s_miki1","@s_ayu1","@s_pon3"] },
      { en:"ANIMATED STICKER", title:"動くLINEスタンプ制作", catch:"あなたのキャラクターが、かわいく動き出す。",
        text:"表情やしぐさに動きをつけた、アニメーションLINEスタンプを制作します。思わず使いたくなる、楽しく親しみやすいスタンプに仕上げます。",
        list:["動く似顔絵スタンプ","動くオリジナルキャラクター","表情・リアクションアニメーション","店舗・企業向けアニメーションスタンプ"], image:"@sv_anim", videos:["@an1","@an2","@an3","@an4","@an5","@an6","@an8","@an9","@an7"] },
      { en:"PORTRAIT", title:"デジタル手描き似顔絵", catch:"写真とはひと味違う、あなただけの一枚。",
        text:"お写真をもとに、手描きの温かみを感じられるデジタル似顔絵を制作します。SNSのプロフィール画像や名刺、プレゼントなど、さまざまな用途にお使いいただけます。",
        list:["個人・家族の似顔絵","SNSアイコン","ビジネス用プロフィール似顔絵","ペットの似顔絵","記念日・プレゼント用イラスト"], image:"@sv_portrait", cover:true, slides:["@il1","@il2","@il3","@il4","@il5","@il6","@il7","@il8","@il9","@il10","@il11","@il12","@il13","@il14","@il15"] },
      { en:"DIGITAL CARD", title:"デジタル名刺制作", catch:"出会いを、その場限りで終わらせない。",
        text:"プロフィールや事業内容、SNS、ホームページなどをまとめたデジタル名刺を制作します。名刺交換のその先につながる、あなたらしい自己紹介ツールをご提案します。",
        list:["個人事業主向けデジタル名刺","企業・店舗向けデジタル名刺","SNS・ホームページへのリンク設置","QRコード連携","プロフィールページ制作"], image:"@sv_dcard", more:{ label:"しくみを見る ↓", href:"#dcard" } },
      { en:"FLYER", title:"チラシ・フライヤー制作", catch:"パッと目を引き、思わず読みたくなるデザインに。",
        text:"商品やサービスの魅力を整理し、届けたい相手に伝わるチラシを制作します。見た目の美しさだけでなく、読みやすさや情報の優先順位、問い合わせまでの流れを大切にします。",
        list:["店舗・サービス紹介チラシ","イベント・マルシェ告知","商品PRフライヤー","集客・販促チラシ","パンフレット"], image:"@sv_flyer" },
      { en:"BUSINESS CARD", title:"名刺デザイン", catch:"あなたの第一印象を、デザインする。",
        text:"事業や人柄に合わせたオリジナル名刺を制作します。シンプルで信頼感のあるデザインから、個性が伝わる印象的なデザインまで対応します。",
        list:["ビジネス名刺","ショップカード","似顔絵入り名刺","QRコード付き名刺","オリジナルデザイン名刺"], image:"@sv_card" },
      { en:"WEBSITE", title:"ホームページ制作", catch:"あなたの魅力が伝わる、Webサイトを。",
        text:"お店やサービスの魅力を整理し、見やすく使いやすいホームページを制作します。スマートフォンでの見やすさや、お問い合わせにつながる導線も大切にします。",
        list:["店舗・企業ホームページ","個人事業主向けホームページ","ランディングページ（LP）","ポートフォリオサイト","イベント特設ページ","SEOを意識したページ構成"], image:"@sv_web" },
      { en:"VIDEO EDITING", title:"動画編集", catch:"伝えたい内容を、見やすく魅力的な映像に。",
        text:"撮影した動画や写真をもとに、目的に合わせて編集します。不要な部分のカットからテロップ、BGM、演出まで、見やすく伝わる動画に仕上げます。",
        list:["YouTube動画編集","Instagramリール","TikTok・ショート動画","企業・店舗PR動画編集","イベント・セミナー動画","商品紹介動画"], image:"@sv_edit" }
    ]
  },

  /* --- デジタル名刺のしくみ --- */
  dcard: {
    en: "DIGITAL BUSINESS CARD",
    title: "名刺が切れても、\nもう慌てない。",
    lead: "スマホやカードをかざすだけで、あなたのプロフィールが相手のスマホに。出会ったその場で、どんな人かを知ってもらえます。",
    before: { image:"@dc0", label:"こんなこと、ありませんか？", text:"「すみません、名刺を切らしていて…」\nせっかくの出会いが、その場で終わってしまう。" },
    steps: [
      { image:"@dc1", title:"スマホかカードを差し出す", text:"紙の名刺がなくても、いつものスマホやカードで交換できます。" },
      { image:"@dc2", title:"かざすだけで、ひらく", text:"相手のスマホにかざすと、あなたのプロフィールページが開きます。" },
      { image:"@dc3", title:"その場で、どんな人か伝わる", text:"SNS・ホームページ・作品まで見てもらえるから、印象に残ります。" },
      { image:"@dc4", title:"ワンタップで保存・LINE登録", text:"連絡先の保存も、LINEの友だち追加もボタンひとつ。" }
    ],
    merits: ["名刺切れの心配なし","その場で情報が見られる","覚えてもらいやすい","LINE登録がかんたん","連絡先を自動で保存"]
  },

  /* --- 制作実績（チラ見せ）
         src は "@名前"（埋め込み済み）か、画像・動画のファイル名／URL に差し替えできます
         url を入れると「全編を見る」リンクが出ます（YouTubeなど） --- */
  works: {
    title: "制作実績を、\nすこしだけお見せします。",
    lead: "手描き動画・似顔絵・LINEスタンプの一部をご紹介します。",
    videos: [
      { src:"@t_hope",  poster:"@po_hope",  title:"Hope Bridge Design 紹介動画", note:"自社紹介の手描き動画（一部）", url:"" },
      { src:"@t_menta", poster:"@po_menta", title:"「企業メンタルの魔法使い」PR動画", note:"講師・サービス紹介の手描き動画（一部）", url:"" }
    ],
    portraits: [
      { src:"@p_couple", label:"カップルの記念に" },
      { src:"@p_girl",   label:"SNSアイコンに" },
      { src:"@p_family", label:"親子の似顔絵" },
      { src:"@p_sakura", label:"背景まで描き込んで" }
    ],
    stickers: [
      { src:"@s_golf1", label:"北海道ゴルファー" },
      { src:"@s_ayu3",  label:"応援してるよ" },
      { src:"@s_pon1",  label:"頑張るぽんこつ女子" },
      { src:"@s_men2",  label:"麺'sBar 堀" },
      { src:"@s_miki2", label:"豹柄みきねぇ" },
      { src:"@s_ayu2",  label:"やったー！" },
      { src:"@s_golf2", label:"北海道最高だね" },
      { src:"@s_pon2",  label:"了解" },
      { src:"@s_men3",  label:"看板犬たち" },
      { src:"@s_miki1", label:"段取りします" },
      { src:"@s_ayu1",  label:"了解！" },
      { src:"@s_men1",  label:"おはよう" },
      { src:"@s_pon3",  label:"ねます" },
      { src:"@s_miki3", label:"とても嬉しいです" }
    ],
    stickerTags: ["写真から作成OK","動くスタンプも対応","お店・企業のキャラクターにも","似顔絵スタンプ"],
    moreText: "ほかの作品も、LINEでお見せできます。",
    moreButton: "LINEで作品を見せてもらう"
  },

  /* --- なぜ手描き動画？ --- */
  why: {
    title: "手描きだから、\n目にとまる。心に残る。",
    lead: "きれいな絵があふれる今だからこそ、手描きの線のゆらぎや、ちょっとした癖が目にとまります。描かれていく過程を、思わず目で追ってしまう。それが手描き動画の強みです。",
    stats: [
      { big:"約15%", label:"記憶に残る", text:"人が話すだけの動画より、同じ内容を約15%多く覚えていた", src:"心理学者 R.ワイズマン氏の実験（2012年）" },
      { big:"1週間後", label:"理解が続く", text:"スライド動画や文章より理解度が高く、1週間後のテストでも上回った", src:"豪ボンド大学の研究（2025年・521人）" },
      { big:"楽しい", label:"最後まで見たくなる", text:"文章・音声・スライド・講演より「楽しい」「引き込まれる」と感じた人が多かった", src:"Turkay & Mouton（2016年・568人）" }
    ],
    fitTitle: "こんな方におすすめです",
    fits: [
      { who:"お店・サロン",           idea:"お店の想いやこだわり紹介", len:"60〜90秒" },
      { who:"講師・士業・コンサル",   idea:"サービスの流れや、よくあるお悩みの解説", len:"1〜2分" },
      { who:"企業・団体",             idea:"会社紹介・採用・研修の動画", len:"2〜3分" },
      { who:"イベント・セミナー主催", idea:"SNSで流せる告知ショート動画", len:"15〜30秒" }
    ]
  },

  /* --- 料金のめやす
         price は数字だけ（例 "3,000"）。from:true で「〜」がつきます --- */
  price: {
    title: "料金のめやす",
    lead: "はじめての方でも頼みやすいように、めやすの料金を載せています。内容やボリュームをうかがって、ご予算の中でできる形をご提案します。",
    taxNote: "",                        // 例："表示はすべて税込です。" 空欄なら非表示
    items: [
      { name:"デジタル手描き似顔絵", price:"3,000",  from:true, unit:"1名・1枚",        note:"SNSアイコンやプレゼントに" },
      { name:"LINEスタンプ",         price:"16,000", from:true, unit:"8個セット・税込",  note:"申請サポート込み" },
      { name:"動くLINEスタンプ",     price:"28,000", from:true, unit:"8個セット・税込",  note:"申請サポート込み" },
      { name:"動画編集",             price:"5,000",  from:true, unit:"1本",             note:"リール・ショート・YouTube" },
      { name:"名刺デザイン",         price:"5,000",  from:true, unit:"片面・印刷代別",   note:"似顔絵入り・QRコード付きも" },
      { name:"デジタル名刺",         price:"8,000",  from:true, unit:"1ページ",         note:"SNS・HPへのリンクをまとめて" },
      { name:"チラシ・フライヤー",   price:"15,000", from:true, unit:"A4片面・印刷代別", note:"イベント・マルシェ告知にも" },
      { name:"ランディングページ",   price:"50,000", from:true, unit:"1ページ",         note:"キャンペーンやサービス紹介に" },
      { name:"ホームページ",         price:"80,000", from:true, unit:"〜5ページ程度",   note:"お店・個人事業主さん向け" }
    ],
    stamp: {
      title: "LINEスタンプの料金",
      lead: "手描きの温かみあるイラストで、あなただけのオリジナルLINEスタンプを制作します。キャラクターデザインからLINEへの申請サポートまで、まるごとお任せください。",
      tables: [
        { name:"通常LINEスタンプ（静止画）", text:"日常使いや、ちょっとしたプレゼント、ビジネス用の名刺代わりにも人気です。",
          rows:[
            { n:"8個",  tag:"まずはお試し",   price:"16,000", note:"家族や身内用、最低限のあいさつセットに" },
            { n:"16個", tag:"一番人気",       price:"30,000", note:"喜怒哀楽がそろって使いやすい", hot:true },
            { n:"24個", tag:"たっぷり使える", price:"45,000", note:"よく使う言葉を網羅したい方に" },
            { n:"32個", tag:"",               price:"60,000", note:"" },
            { n:"40個", tag:"フルセット",     price:"75,000", note:"クリエイター並みのボリューム" }
          ] },
        { name:"動くLINEスタンプ（アニメーション）", text:"ちょこっと動くイラストで、相手の目を引くワンランク上のスタンプです。",
          rows:[
            { n:"8個",  tag:"おすすめ",       price:"28,000", note:"動くスタンプの基本セット", hot:true },
            { n:"16個", tag:"リッチに展開",   price:"52,000", note:"バリエーション豊かに動かしたい方に" }
          ] }
      ],
      includesTitle: "料金に含まれるもの",
      includes: ["キャラクターデザイン・ラフ制作（修正2回まで無料）","セリフ（文字）入れ","LINEの審査用画像（メイン・タブ画像）の作成","LINEへの審査提出サポート（リジェクト時の修正も対応）"],
      optionsTitle: "オプション（追加費用）",
      options: [
        { k:"おまかせ企画料", v:"＋5,000円", note:"キャラクターやセリフが思いつかない場合、コンセプトからご提案します。" },
        { k:"複雑なデザイン・小物指定", v:"要お見積り", note:"1枚に複数人を描く場合や、細かい背景・アイテムが必要な場合はご相談ください。" }
      ],
      taxNote: "表示はすべて税込です。"
    },
    movie: {
      title: "手描き動画（ホワイトボードアニメーション）",
      lead: "3分以内の動画の料金です。ご予算と目的に合わせて、3つのプランから選べます。",
      plans: [
        { tag:"梅", name:"コスト重視", price:"80,000", from:false, method:"既存ツール（テンプレート素材）",
          points:["費用をできるだけおさえたい方に","既存のキャラクターや素材を組み合わせて、スピーディーに制作"], recommend:false },
        { tag:"竹", name:"おすすめ", price:"130,000", from:false, method:"完全手描きイラスト × AIアニメーション",
          points:["完全オリジナルのイラストで、ほかと被らない動画に","絵コンテの段階なら、修正は何度でも","手描きの温かみと、AIの効率を掛け合わせた一番人気のプラン"], recommend:true },
        { tag:"松", name:"完全フルオーダー", price:"220,000", from:true, method:"完全手描き（フルコマ撮り／フル動画）",
          points:["1コマずつすべて手作業で動かす、本格仕様","ブランディングや大きなプロモーションに"], recommend:false }
      ],
      reasonsTitle: "竹プランが選ばれる3つの理由",
      reasons: [
        { title:"手描きなのに、手に取りやすい価格", text:"完全オリジナルの手描きイラストに、AIによるアニメーションを組み合わせることで、手描きの温かみはそのままに、制作費をおさえています。" },
        { title:"絵コンテの修正は、何度でも", text:"動画づくりで一番心配な「できあがったら、イメージと違った」を防ぐために、絵コンテの段階では納得いくまで練り直せます。" },
        { title:"必要なものだけ選べるオプション制", text:"ナレーション音声・BGM・文字起こしはオプションです。「音声は自分で用意する」「BGMはいらない」場合は、その分の費用はかかりません。" }
      ],
      revisionsTitle: "制作スタート後の修正について",
      revisions: [
        { k:"文字の変更・AI音声の微調整（軽微な修正）", v:"1回 3,000円" },
        { k:"イラストの描き直しを伴う変更（大幅な修正）", v:"1回 15,000円" }
      ]
    },
    notes: [
      "料金はめやすです。内容・ボリューム・納期によって変わります。",
      "お見積りは無料です。ご予算が決まっている場合は、その中でできる形をご提案します。"
    ],
    ctaText: "「これくらいでできる？」だけでも大丈夫です。",
    ctaButton: "LINEで料金を聞いてみる"
  },

  /* --- まとめて相談 --- */
  plan: {
    title: "複数の制作も、\nまとめてご相談いただけます。",
    lead: "それぞれ別の制作者に依頼する手間を減らし、デザインの雰囲気をそろえて制作できます。",
    items: [
      { en:"OPENING",   who:"お店を開業する方なら",         combo:["名刺","チラシ","ホームページ","PR動画"] },
      { en:"PERSONAL",  who:"個人事業主・講師の方なら",     combo:["デジタル名刺","似顔絵","自己紹介動画"] },
      { en:"FAN MAKING",who:"お店のファンを増やしたい方なら", combo:["オリジナルキャラクター","LINEスタンプ","SNS動画"] }
    ]
  },

  /* --- 制作パートの締め（濃い帯） --- */
  talk: {
    title: "まずは、あなたのお話を\n聞かせてください。",
    voices: ["何を作ればいいのか分からない","こんなこともお願いできる？"],
    text: "そんな段階からでも大丈夫です。目的やご予算、ご希望をうかがいながら、一緒に考えていきます。",
    closing: "あなたの魅力、カタチにします。",
    button: "LINEで無料相談する"
  },

  /* --- つながる活動（CONNECTION & COMMUNITY） --- */
  community: {
    en: "CONNECTION & COMMUNITY",
    title: "人と人をつなぎ、\n新しい可能性を広げる。",
    lead: "出会いから、仕事も未来も広がっていく。一人ひとりの想いを大切に、人と人、仕事とチャンスをつなぐ活動をしています。",
    voices: ["もっと自分のお店を知ってもらいたい","マルシェに出店してみたい","自分の商品を全国に届けたい","新しいスキルを身につけたい","同じ想いを持つ仲間と出会いたい"],
    items: [
      { title:"お繋ぎ活動・ビジネスマッチング", catch:"あなたの「探していた！」を、\n人とのつながりから。",
        text:["お仕事の相談、集客、協業、仲間づくりなど。それぞれの目的やご希望をうかがい、人やサービスとのご縁をお繋ぎしています。"],
        recommend:["お仕事のつながりを広げたい","自分のサービスを知ってもらいたい","集客や販路について相談したい","一緒に活動できる仲間を探している","新しいことに挑戦したい"],
        ctas:[{ label:"お繋ぎについて相談する", url:"" }] },
      { title:"マルシェ・イベント案内", catch:"出店する人も、\n遊びに行く人も。",
        text:["地域のマルシェやイベントを通じて、新しい出会いや交流のきっかけをつくっています。出店者さんと主催者さんをつないだり、イベント情報をお届けしたり。","出店して終わりではなく、次のご縁につながる交流を大切にしています。"],
        recommend:["マルシェに出店したい","自分の商品やサービスを広めたい","イベントの主催者とつながりたい","地域のイベントに遊びに行きたい","出店者同士で交流したい"],
        ctas:[{ label:"マルシェ情報を見る", url:"https://lin.ee/Q06329r" },{ label:"出店について相談する", url:"" }] },
      { title:"ECサイト・販路拡大のご案内", catch:"あなたの商品を、\nもっと多くの人へ。",
        text:["「ネットでも販売してみたい」「今より販路を広げたい」「商品を知ってもらう機会を増やしたい」。そんな方に向けて、ECサイトやオンライン販売の仕組みをご案内しています。","店舗販売だけでなく、インターネットを通じた新しい販売方法を知るきっかけに。"],
        recommend:["ハンドメイド作品を販売している","食品や雑貨などの商品を扱っている","ネット販売に興味がある","販売先を増やしたい","自分に合う販売方法を探している"],
        ctas:[{ label:"ECサイトについて話を聞く", url:"" }] },
      { title:"スクール・学びのご案内", catch:"「やってみたい」を、\n未来の選択肢に。",
        text:["新しいスキルを身につけたい方や、自分の可能性を広げたい方へ。Webデザイン・手描き動画・AIなど、学びの選択肢をご案内しています。","未経験からの挑戦や、今のお仕事にスキルを活かしたい方にも。"],
        schools:[
          { name:"Webデザインスクール", text:"ホームページやバナーなど、デザイン制作に必要なスキルを学びたい方へ。" },
          { name:"手描き動画スクール",   text:"イラストやストーリーを使った動画制作に興味がある方へ。" },
          { name:"AIスクール",           text:"AIを仕事や日常に活用したい方、新しいスキルを身につけたい方へ。" }
        ],
        note:"※ 各スクールの内容・受講条件・費用は、ご案内先によって異なります。",
        ctas:[{ label:"スクールについて相談する", url:"" }] }
    ]
  },

  /* --- プライバシーポリシー（フッターのリンクから開きます） --- */
  privacy: {
    title: "プライバシーポリシー",
    intro: "Hope Bridge Design（以下「当方」）は、お客様の個人情報を適切に取り扱うことを大切に考え、以下のとおりプライバシーポリシーを定めます。",
    sections: [
      { h:"1. 取得する情報", p:"当方は、公式LINE・SNS・メール等でのお問い合わせやご依頼の際に、次の情報を取得することがあります。", list:["お名前（ニックネームを含む）","LINEのアカウント名・メールアドレス・電話番号などの連絡先","ご依頼内容、お問い合わせ内容","制作のためにご提供いただいた写真・ロゴ・文章などの素材","お見積り・ご請求に必要な情報（屋号、ご住所など）"] },
      { h:"2. 利用目的", p:"取得した情報は、次の目的の範囲内で利用します。", list:["お問い合わせへの回答、ご相談への対応","制作物の企画・制作・納品、お見積り・ご請求","マルシェ・イベント、お繋ぎ活動などのご案内（ご希望の方のみ）","サービス向上のための参考"] },
      { h:"3. 制作物・素材の取り扱い", p:"ご提供いただいた写真や素材は、ご依頼の制作にのみ使用します。完成した作品をホームページやSNSで制作実績として紹介する場合は、事前にお客様の了承をいただきます。" },
      { h:"4. 第三者への提供", p:"当方は、次の場合を除き、ご本人の同意なく個人情報を第三者に提供しません。", list:["法令に基づく場合","人の生命・身体・財産の保護のために必要で、ご本人の同意を得ることが難しい場合","お繋ぎ活動・ビジネスマッチングで、ご本人の了承を得たうえでご紹介先にお伝えする場合"] },
      { h:"5. 業務の委託", p:"制作や配送などの業務の一部を外部に委託する場合、必要な範囲で情報を提供することがあります。その際は、委託先が適切に管理するよう努めます。" },
      { h:"6. 安全管理", p:"取得した個人情報は、紛失・漏えい・改ざんなどが起きないよう、適切に管理します。不要になった情報は、速やかに削除します。" },
      { h:"7. 外部サービスについて", p:"当サイトには、LINE・Instagramなど外部サービスへのリンクがあります。リンク先での個人情報の取り扱いは、各サービスの方針に従います。" },
      { h:"8. 開示・訂正・削除のご請求", p:"ご本人から、個人情報の開示・訂正・利用停止・削除のご請求があった場合は、ご本人であることを確認したうえで、速やかに対応します。" },
      { h:"9. ポリシーの変更", p:"本ポリシーは、必要に応じて内容を見直し、変更することがあります。変更後の内容は、当サイトに掲載した時点から適用されます。" },
      { h:"10. お問い合わせ窓口", p:"個人情報の取り扱いに関するお問い合わせは、公式LINEからご連絡ください。" }
    ],
    signature: "Hope Bridge Design　りーたん",
    date: "2026年10月30日 制定"
  },

  /* --- 最後の呼びかけ --- */
  final: {
    title: "あなたの「やってみたい」を\n聞かせてください。",
    voices: ["こんなことに興味がある","ちょっと話だけ聞いてみたい"],
    text: "まだ何をしたいか決まっていなくても大丈夫。そんな小さなきっかけから、新しいご縁が生まれるかもしれません。",
    closing: "つくることも、つながることも。\nあなたの一歩を応援します。",
    button: "LINEで気軽に相談する"
  }
};
/* =====================================================================
   ★ 編集エリアここまで（下は基本的に触らなくてOK）
   ===================================================================== */

const C = CONFIG, B = C.brand, K = C.consult;
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const nl = s => esc(s).replace(/\n/g, "<br>");
const pad = n => String(n).padStart(2, "0");
const pic = (src, label, cls="") => src
  ? `<div class="${cls}"><img class="ph-img" src="${esc(src)}" alt="${esc(label)}" loading="lazy"></div>`
  : `<div class="ph ${cls}">${esc(label)}</div>`;
const line = () => B.lineUrl || "#contact";
const ext = u => /^https?:/.test(u) ? ` target="_blank" rel="noopener"` : "";
const link = (u, label, cls="btn") => { const h = u || line(); return `<a class="${cls}" href="${esc(h)}"${ext(h)}>${esc(label)}</a>`; };
const head = (no, en, title, lead) => `
  <div class="sec-head rv">
    <div class="sec-label">${no ? `<span class="no">${pad(no)}</span>` : ""}<span class="en">${esc(en)}</span></div>
    <h2>${nl(title)}</h2>${lead ? `<p>${esc(lead)}</p>` : ""}
  </div>`;
const md = v => (typeof v === "string" && v[0] === "@" && typeof MEDIA !== "undefined") ? (MEDIA[v.slice(1)] || "") : (v || "");
const chara = (k, cls) => (C.decor && C.decor.chara !== false && typeof MEDIA !== "undefined" && MEDIA["c_"+k]) ? `<span class="chara-w ${cls} c-${k}" aria-hidden="true"><img class="chara" src="${MEDIA["c_"+k]}" alt=""><i class="spk k1"></i><i class="spk k2"></i><i class="spk k3"></i></span>` : "";
const lily = (k, cls) => (C.decor && C.decor.show && typeof LILY !== "undefined" && LILY[k]) ? `<img class="lily ${cls}" src="${LILY[k]}" alt="" aria-hidden="true" style="opacity:${C.decor.opacity}">` : "";
const voices = arr => `<ul class="voice rv">${arr.map(v => `<li>「${esc(v)}」</li>`).join("")}</ul>`;

const SVC = (s,i) => `
    <article class="service">
      ${(s.slides || s.videos) ? `<div class="s-img s-slider-wrap${s.cover ? " s-cover" : ""}"><div class="s-slider" aria-label="${esc(s.title)}の制作例">${(s.videos || s.slides).map((x,j) => `<div class="s-slide">${s.videos ? `<video src="${md(x)}" muted loop playsinline preload="metadata" aria-label="動くスタンプの制作例${j+1}"></video>` : `<img src="${md(x)}" alt="${s.cover ? "似顔絵・イラスト" : "LINEスタンプ"}の制作例${j+1}" loading="lazy">`}</div>`).join("")}</div><button type="button" class="s-arrow prev" aria-label="前へ">‹</button><button type="button" class="s-arrow next" aria-label="次へ">›</button><b class="s-badge">${pad(i+1)}</b><div class="s-dots">${(s.videos || s.slides).map((_,j) => `<i class="${j?"":"on"}"></i>`).join("")}</div></div>` : s.image ? `<div class="s-img"><img src="${md(s.image)}" alt="${esc(s.title)}のイメージ" loading="lazy"><b class="s-badge">${pad(i+1)}</b></div>` : ""}
      <div class="s-no"><span class="en">${esc(s.en)}</span>${s.image ? "" : `<b>${pad(i+1)}</b>`}</div>
      <h3>${esc(s.title)}</h3>
      <div class="catch">${esc(s.catch)}</div>
      <details class="more"><summary><span>詳しく見る</span></summary><div class="more-body">
      <p>${esc(s.text)}</p>
      <ul class="chips">${s.list.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div></details>${s.more ? `<a class="s-more" href="${esc(s.more.href)}">${esc(s.more.label)}</a>` : ""}
    </article>`;

const PAGE = (document.getElementById("app").dataset.page || "top");
function render(){
  let no = 0; const N = () => ++no;
  const SEC = {
    hero: () => `<section class="hero">
  <div class="hero-visual">
    <img class="hv-wide" src="${md(C.hero.wide)}" alt="${esc(C.hero.slides.map(x => x.alt).join(" / "))}">
    <div class="hero-slides" id="heroSlides" role="img" aria-label="${esc(C.hero.slides.map(x => x.alt).join(" / "))}">
      <div class="hs-frame">${C.hero.slides.map((x,i) => `<div class="hs${i===0?" on":""}"><img src="${md(x.src)}" alt="" ${i?'loading="lazy"':""}>${x.caption ? `<div class="hs-cap"><span class="hs-script">${esc(x.caption.script)}</span><span class="hs-title">${esc(x.caption.title)}</span><span class="hs-text">${nl(x.caption.text)}</span></div>` : ""}</div>`).join("")}</div>
      <div class="hs-dots">${C.hero.slides.map((_,i) => `<button type="button" aria-label="${i+1}枚目を表示" class="${i===0?"on":""}" data-i="${i}"></button>`).join("")}</div>
    </div>
    <a class="hv-scroll" href="#heroText" aria-label="下へスクロール"><span>SCROLL</span></a>
  </div>
  ${lily("d","l-hero")}<div class="wrap" id="heroText">
  <div class="hero-grid">
    <div class="rv">
      <p class="kicker">${esc(C.hero.kicker)}</p>
      <h1>${nl(C.hero.titleLine1)}<em>${esc(C.hero.titleLine2)}</em></h1>
      <p class="hero-lead">${esc(C.hero.lead)}</p>
      <div class="offer"><span class="tag">${esc(K.tag)}</span><span class="free">${esc(K.text)}</span></div>
      <div class="hero-cta">
        ${link(B.lineUrl, K.button)}
        <a class="btn ghost" href="service.html">制作できるものを見る</a>
      </div>
    </div>
  </div>
  <dl class="facts rv">${C.facts.map(f => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("")}</dl>
</div>
<div class="marquee" aria-hidden="true"><div class="marquee-in">${esc(C.hero.marquee.repeat(5))}</div></div>
</section>`,
    campaign: () => `<section class="campaign"><div class="wrap">
  <div>
    <p class="c-head en">FREE CONSULTATION</p>
    <p class="c-main">${esc(K.band)}</p>
    <p class="c-note">${esc(K.bandNote)}</p>
  </div>
  ${link(B.lineUrl, K.button)}
</div></section>`,
    concern: () => `<section class="sec alt">${chara("think","ch-head")}<div class="wrap">
  ${head(N(), "CONCERN", C.concern.title)}
  <ul class="concerns rv">${C.concern.items.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
  <div class="philo rv">${lily("f","l-philo")}<div class="lbl">${esc(C.concern.philoLabel)}</div><h3>${nl(C.concern.philoTitle)}</h3><p>${esc(C.concern.philoText)}</p></div>
</div></section>`,
    service: () => `<section class="sec" id="service">${chara("idea","ch-head")}<div class="wrap">
  ${head(N(), "SERVICE", C.services.title, C.services.lead)}
  <div class="services rv">${C.services.items.slice(0,3).map((s,i) => SVC(s,i)).join("")}</div>
  <details class="acc acc-more rv"><summary><span class="am-open">ほかの制作メニューを見る<small>（あと${C.services.items.length-3}種類）</small></span><span class="am-close">閉じる</span><i class="acc-ic" aria-hidden="true"></i></summary>
    <div class="services">${C.services.items.slice(3).map((s,i) => SVC(s,i+3)).join("")}</div></details>
</div></section>`,
    dcard: () => `<section class="sec dcard" id="dcard"><div class="wrap">
  ${head(0, C.dcard.en, C.dcard.title, C.dcard.lead)}
  <div class="dc-before rv">
    <div class="dc-bimg"><img src="${md(C.dcard.before.image)}" alt="名刺を切らして困っている様子" loading="lazy"></div>
    <div class="dc-btext"><span class="dc-q">${esc(C.dcard.before.label)}</span><p>${nl(C.dcard.before.text)}</p><button type="button" class="dc-arrow" id="dcToggle" aria-expanded="false" aria-controls="dcFlow"><span class="dc-o">デジタル名刺なら</span><span class="dc-c">閉じる</span><i aria-hidden="true"></i></button></div>
  </div>
  <div id="dcFlow" class="dc-flow" hidden>
  <ol class="dc-steps">${C.dcard.steps.map((st,i) => `
    <li><div class="dc-img"><img src="${md(st.image)}" alt="${esc(st.title)}" loading="lazy"><b>${i+1}</b></div><h3>${esc(st.title)}</h3><p>${esc(st.text)}</p></li>`).join("")}</ol>
  <ul class="dc-merits">${C.dcard.merits.map(m => `<li>${esc(m)}</li>`).join("")}</ul>
  </div>
</div></section>`,
    works: () => `<section class="sec alt" id="works">${chara("point","ch-head")}<div class="wrap">
  ${head(N(), "WORKS", C.works.title, C.works.lead)}
  <div class="works-block rv">
    <div class="wb-head"><h3>手描き動画</h3><span class="en">HAND-DRAWN MOVIE</span><p>音声なしで、一部をくり返し再生しています。</p></div>
    <div class="videos">${C.works.videos.map(v => `
      <figure class="vcard" style="margin:0">
        <div class="vframe"><video src="${md(v.src)}" poster="${md(v.poster)}" autoplay muted loop playsinline preload="metadata" aria-label="${esc(v.title)}"></video><span class="badge">一部抜粋</span></div>
        <figcaption><b>${esc(v.title)}</b><span>${esc(v.note)}</span>${v.url ? `<br><a href="${esc(v.url)}" target="_blank" rel="noopener">全編を見る →</a>` : ""}</figcaption>
      </figure>`).join("")}</div>
  </div>
  <div class="works-block rv">
    <div class="wb-head"><h3>デジタル手描き似顔絵</h3><span class="en">PORTRAIT</span><p>お写真をもとに、手描きの温かみで仕上げます。</p></div>
    <div class="prints">${C.works.portraits.map(p => `
      <figure class="print"><div class="img"><img src="${md(p.src)}" alt="似顔絵の制作例：${esc(p.label)}" loading="lazy"></div><figcaption>${esc(p.label)}</figcaption></figure>`).join("")}</div>
  </div>
  <div class="works-block rv">
    <div class="wb-head"><h3>LINEスタンプ</h3><span class="en">LINE STICKER</span><p>絵柄は、ご希望に合わせて描き分けます。</p></div>
    <div class="sticker-rail"><div class="sticker-track">${[...C.works.stickers, ...C.works.stickers].map((t,i) => `
      <figure class="sticker"${i >= C.works.stickers.length ? ' aria-hidden="true"' : ""}><img src="${md(t.src)}" alt="LINEスタンプの制作例：${esc(t.label)}" loading="lazy"><figcaption>${esc(t.label)}</figcaption></figure>`).join("")}</div></div>
    <div class="sticker-tags">${C.works.stickerTags.map(t => `<span>${esc(t)}</span>`).join("")}</div>
  </div>
  <div class="works-more rv"><p>${esc(C.works.moreText)}</p>${link(B.lineUrl, C.works.moreButton)}</div>
</div></section>`,
    why: () => `<section class="sec" id="why"><div class="wrap">
  ${head(N(), "WHY HAND-DRAWN", C.why.title, C.why.lead)}
  <div class="stats3 rv">${C.why.stats.map(x => `
    <div class="stat3"><div class="st-label">${esc(x.label)}</div><div class="st-big">${esc(x.big)}</div><p>${esc(x.text)}</p><small>${esc(x.src)}</small></div>`).join("")}</div>
  <div class="fit rv"><h3>${esc(C.why.fitTitle)}</h3>
    <ul>${C.why.fits.map(f => `<li><b>${esc(f.who)}</b><span>${esc(f.idea)}</span><em>${esc(f.len)}</em></li>`).join("")}</ul></div>
</div></section>`,
    price: () => `<section class="sec alt" id="price">${chara("cheer","ch-head")}<div class="wrap">
  ${head(N(), "PRICE", C.price.title, C.price.lead)}
  <details class="acc rv"><summary><span class="acc-t"><b>制作メニューの料金</b><small>似顔絵・スタンプ・名刺・Webなど${C.price.items.length}種類　<em>${esc(C.price.items[0].price)}円〜</em></small></span><i class="acc-ic" aria-hidden="true"></i></summary><div class="acc-body">
  <div class="pcards">${C.price.items.map(it => `
    <div class="pcard"><div class="pc-name">${esc(it.name)}</div>
      <div class="pc-price"><b>${esc(it.price)}</b><span>円${it.from ? "〜" : ""}</span></div>
      <div class="pc-unit">${esc(it.unit)}</div><div class="pc-note">${esc(it.note)}</div></div>`).join("")}</div>
  </div></details>

  <details class="acc rv"><summary><span class="acc-t"><b>${esc(C.price.stamp.title)}</b><small>静止画・動くスタンプ／申請サポート込み　<em>${esc(C.price.stamp.tables[0].rows[0].price)}円〜</em></small></span><i class="acc-ic" aria-hidden="true"></i></summary><div class="acc-body">
    <p class="acc-lead">${esc(C.price.stamp.lead)}</p>
    <div class="st-tables">${C.price.stamp.tables.map(t => `
      <div class="st-table"><h4>${esc(t.name)}</h4><p>${esc(t.text)}</p>
        <ul>${t.rows.map(r => `<li class="${r.hot ? "hot" : ""}"><span class="st-n">${esc(r.n)}</span><span class="st-d">${r.tag ? `<i>${esc(r.tag)}</i>` : ""}${r.note ? `<small>${esc(r.note)}</small>` : ""}</span><span class="st-p"><b>${esc(r.price)}</b>円</span></li>`).join("")}</ul></div>`).join("")}</div>
    <div class="st-extra">
      <div><h4>${esc(C.price.stamp.includesTitle)}</h4><ul class="st-inc">${C.price.stamp.includes.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
      <div><h4>${esc(C.price.stamp.optionsTitle)}</h4><dl class="st-opt">${C.price.stamp.options.map(o => `<div><dt>${esc(o.k)}<b>${esc(o.v)}</b></dt><dd>${esc(o.note)}</dd></div>`).join("")}</dl></div>
    </div>
    <p class="st-tax">${esc(C.price.stamp.taxNote)}</p>
  </div></details>

  <div class="movie-price">
    <details class="acc"><summary><span class="acc-t"><b>手描き動画の料金</b><small>ホワイトボードアニメーション・3分以内・${C.price.movie.plans.length}つのプラン　<em>${esc(C.price.movie.plans[0].price)}円〜</em></small></span><i class="acc-ic" aria-hidden="true"></i></summary><div class="acc-body">
    <p class="acc-lead">${esc(C.price.movie.lead)}</p>
    <div class="plans">${C.price.movie.plans.map(pl => `
      <div class="plan${pl.recommend ? " rec" : ""}">
        ${pl.recommend ? `<div class="rec-badge">いちばん人気</div>` : ""}
        <div class="pl-tag"><span>${esc(pl.tag)}</span>${esc(pl.name)}</div>
        <div class="pl-price"><b>${esc(pl.price)}</b><span>円${pl.from ? "〜" : ""}</span><small>3分以内</small></div>
        <div class="pl-method">${esc(pl.method)}</div>
        <ul>${pl.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      </div>`).join("")}</div>
    <div class="why">
      <h4>${esc(C.price.movie.reasonsTitle)}</h4>
      <div class="why-grid">${C.price.movie.reasons.map((r,i) => `<div class="why-item"><span class="why-no">${i+1}</span><b>${esc(r.title)}</b><p>${esc(r.text)}</p></div>`).join("")}</div>
    </div>
    <div class="revs"><h4>${esc(C.price.movie.revisionsTitle)}</h4>
      <dl>${C.price.movie.revisions.map(r => `<div><dt>${esc(r.k)}</dt><dd>${esc(r.v)}</dd></div>`).join("")}</dl></div>
    </div></details>
  </div>

  <div class="price-foot rv">
    <ul>${C.price.notes.map(n => `<li>${esc(n)}</li>`).join("")}${C.price.taxNote ? `<li>${esc(C.price.taxNote)}</li>` : ""}</ul>
    <div class="works-more"><p>${esc(C.price.ctaText)}</p>${link(B.lineUrl, C.price.ctaButton)}</div>
  </div>
</div></section>`,
    plan: () => `<section class="sec bundle" id="plan">${lily("c","l-plan")}<div class="wrap">
  ${head(N(), "PLAN", C.plan.title, C.plan.lead)}
  <div class="price-list rv">${C.plan.items.map(p => `
    <div class="price-row">
      <div class="who"><small>${esc(p.en)}</small>${esc(p.who)}</div>
      <div class="combo">${p.combo.map(c => `<span>${esc(c)}</span>`).join(`<i>＋</i>`)}</div>
    </div>`).join("")}</div>
</div></section>`,
    talk: () => `<section class="sec dark talk"><div class="wrap">${chara("coffee","ch-band")}
  ${head(0, "LET'S TALK", C.talk.title)}
  ${voices(C.talk.voices)}
  <p style="max-width:34em;margin:0 auto;color:var(--on-dark)">${esc(C.talk.text)}</p>
  <p class="closing">${esc(C.talk.closing)}</p>
  <div class="contact-row">${link(B.lineUrl, C.talk.button, "btn")}</div>
</div></section>`,
    community: () => `<section class="sec alt" id="community">${chara("hug","ch-head")}<div class="wrap">
  ${head(N(), C.community.en, C.community.title, C.community.lead)}
  ${voices(C.community.voices)}
  <div class="acts">${C.community.items.map((a,i) => `
    <article class="act rv">
      <div>
        <div class="a-no">${pad(i+1)}</div>
        <h3>${esc(a.title)}</h3>
        <p class="catch">${nl(a.catch)}</p>
        <p>${esc(a.text[0])}</p>
        <details class="more"><summary><span>${a.schools ? "ご案内できる学びを見る" : "こんな方におすすめ"}</span></summary><div class="more-body">
          ${a.text.slice(1).map(t => `<p>${esc(t)}</p>`).join("")}
          ${a.recommend ? `<div class="recommend"><ul>${a.recommend.map(r => `<li>${esc(r)}</li>`).join("")}</ul></div>` : ""}
          ${a.schools ? `<div class="schools">${a.schools.map(s => `<div class="school"><b>${esc(s.name)}</b><p>${esc(s.text)}</p></div>`).join("")}</div>` : ""}
          ${a.note ? `<p class="small">${esc(a.note)}</p>` : ""}
        </div></details>
        <div class="ctas">${a.ctas.map((c,j) => link(c.url, c.label, j ? "btn ghost" : "btn")).join("")}</div>
      </div>
    </article>`).join("")}</div>
</div></section>`,
    profile: () => `<section class="sec profile" id="profile">${lily("a","l-prof")}<div class="wrap">
  <div class="pf-grid">
    <div class="pf-photo rv">
      <div class="pf-frame"><img src="${md(C.profile.image)}" alt="${esc(C.profile.name)}のイメージ写真" loading="lazy"></div>
      <div class="pf-card"><b>${esc(C.profile.name)}</b><span>${esc(C.profile.brand)}</span><span>${esc(C.profile.base)}</span></div>
    </div>
    <div class="pf-text">
      ${head(0, C.profile.en, C.profile.title)}
      <p class="pf-role rv">${esc(C.profile.role)}</p>
      <div class="pf-story rv">
        <p class="pf-intro">${esc(C.profile.intro)}</p>
        ${C.profile.story.map(t => `<p>${esc(t)}</p>`).join("")}
        <p class="pf-em">${nl(C.profile.highlight)}</p>
      </div>
      <div class="pf-quote rv">${nl(C.profile.box)}</div>
      <div class="pf-close rv">
        ${C.profile.closing.map((t,i) => `<p class="${i===C.profile.closing.length-1 ? "last" : ""}">${esc(t)}</p>`).join("")}
        <div class="pf-foot"><span class="pf-sign">${esc(C.profile.sign)}</span></div>
      </div>
    </div>
  </div>
</div></section>`,
    contact: () => `<section class="sec dark talk" id="contact"><div class="wrap">${chara("banzai","ch-band")}
  ${head(0, "CONTACT", C.final.title)}
  ${voices(C.final.voices)}
  <p style="max-width:34em;margin:0 auto;color:var(--on-dark)">${esc(C.final.text)}</p>
  <p class="closing">${nl(C.final.closing)}</p>
  <div class="contact-row">
    ${B.lineUrl ? link(B.lineUrl, C.final.button) : `<span class="btn" style="opacity:.6">${esc(C.final.button)}（LINEのURLを設定してください）</span>`}
    ${B.instagramId ? `<a class="btn ghost" style="color:#fff;border-color:#fff" href="${esc(B.instagramUrl)}" target="_blank" rel="noopener">Instagram @${esc(B.instagramId)}</a>` : ""}
  </div>
</div></section>`,
    digest: () => `<section class="sec alt digest"><div class="wrap">
  ${head(0, "MENU", C.digest.title, C.digest.lead)}
  <div class="dg-grid">${C.digest.items.map(d => `<a class="dg" href="${esc(d.href)}"><span class="dg-img"><img src="${md(d.image)}" alt="" loading="lazy"></span><span class="dg-body"><span class="en">${esc(d.en)}</span><b>${esc(d.title)}</b><small>${esc(d.text)}</small><i class="dg-go" aria-hidden="true">→</i></span></a>`).join("")}</div>
</div></section>`,
    privacy: () => `<section class="sec pp-page"><div class="wrap"><div class="pp-doc">
  <p>${esc(C.privacy.intro)}</p>
  ${C.privacy.sections.map(x => `<h2>${esc(x.h)}</h2><p>${esc(x.p)}</p>${x.list ? `<ul>${x.list.map(l => `<li>${esc(l)}</li>`).join("")}</ul>` : ""}`).join("")}
  ${B.lineUrl ? `<p class="pp-cta">${link(B.lineUrl, "公式LINEで問い合わせる", "btn")}</p>` : ""}
  <p class="pp-sign">${esc(C.privacy.date)}<br>${esc(C.privacy.signature)}</p>
</div></div></section>`,
    pagehead: () => { const P = C.pages[PAGE]; return P ? `<section class="page-hero"><div class="wrap"><nav class="crumb" aria-label="現在地"><a href="index.html">トップ</a><span>›</span>${esc(P.title)}</nav><p class="ph-en">${esc(P.en)}</p><h1>${esc(P.title)}</h1><p class="ph-lead">${esc(P.lead)}</p></div></section>` : ""; }
  };
  const LAYOUT = {
    top:     ["hero","campaign","digest","concern","why","talk","contact"],
    service: ["pagehead","service","dcard","why","plan","contact"],
    works:   ["pagehead","works","contact"],
    price:   ["pagehead","price","plan","contact"],
    connect: ["pagehead","community","contact"],
    about:   ["pagehead","profile","talk","contact"],
    privacy: ["pagehead","privacy"]
  };
  const MAIN = (LAYOUT[PAGE] || LAYOUT.top).map(k => SEC[k]()).join("\n");
  document.getElementById("app").innerHTML = `
<header class="hd"><div class="wrap hd-in">
  <a class="logo" href="index.html"><b>${esc(B.shortName)}</b><small>${esc(B.tagline)}</small></a>
  <nav class="nav" aria-label="メインメニュー">
    ${C.nav.map(n => `<a href="${esc(n.href)}"${n.page===PAGE?' aria-current="page"':""}>${esc(n.ja)}</a>`).join("")}
    ${link(B.lineUrl, "LINEで相談", "btn sm")}
  </nav>
  <button class="burger" aria-label="メニューを開く" aria-expanded="false" id="burger"><span></span><span></span><span></span></button>
</div></header>
<nav class="drawer" aria-label="スマートフォンメニュー">
  <a href="index.html"><span>トップ</span><span class="en">HOME</span></a>
  ${C.nav.map(n => `<a href="${esc(n.href)}"><span>${esc(n.ja)}</span><span class="en">${esc(n.en)}</span></a>`).join("")}
  ${link(B.lineUrl, K.button)}
</nav>

<main id="top">
${MAIN}
</main>

<footer class="ft"><div class="wrap">
  <a class="logo" href="index.html"><b>${esc(B.shortName)}</b></a>
  <ul><li>${esc(B.name)}</li><li>${esc(B.tagline)}</li><li>拠点　${esc(B.area)}</li><li>代表　${esc(B.representative)}</li></ul>
  <p class="ft-links"><a class="pp-open" href="privacy.html">${esc(C.privacy.title)}</a></p>
  <p class="tiny">© ${esc(B.name)}</p>
</div></footer>

<div class="pp" id="pp" hidden role="dialog" aria-modal="true" aria-labelledby="ppTitle">
  <div class="pp-bg" data-ppclose></div>
  <div class="pp-box">
    <div class="pp-head"><h2 id="ppTitle">${esc(C.privacy.title)}</h2><button type="button" class="pp-x" data-ppclose aria-label="閉じる"></button></div>
    <div class="pp-body">
      <p>${esc(C.privacy.intro)}</p>
      ${C.privacy.sections.map(x => `<h3>${esc(x.h)}</h3><p>${esc(x.p)}</p>${x.list ? `<ul>${x.list.map(l => `<li>${esc(l)}</li>`).join("")}</ul>` : ""}`).join("")}
      ${B.lineUrl ? `<p>${link(B.lineUrl, "公式LINEで問い合わせる", "btn sm")}</p>` : ""}
      <p class="pp-sign">${esc(C.privacy.date)}<br>${esc(C.privacy.signature)}</p>
    </div>
  </div>
</div>

<a class="fixbar" href="${esc(line())}"${ext(line())} id="fixbar"><span class="t">${esc(K.tag)}｜何を作るか<br>決まっていなくてもOK</span><span class="go">${esc(K.button)}</span></a>`;
}

/* ---------- 起動 ---------- */
render();

/* ---------- デジタル名刺の開閉 ---------- */
(function(){
  const b = document.getElementById("dcToggle"), f = document.getElementById("dcFlow");
  if (!b || !f) return;
  b.addEventListener("click", () => {
    const open = f.hidden;
    f.hidden = !open; b.setAttribute("aria-expanded", open);
    if (open) setTimeout(() => f.scrollIntoView({behavior:"smooth", block:"start"}), 60);
  });
})();
/* ---------- スタンプのスライド ---------- */
document.querySelectorAll(".s-slider-wrap").forEach(w => {
  const sl = w.querySelector(".s-slider"), slides = [...sl.children], dots = [...w.querySelectorAll(".s-dots i")];
  let idx = 0, timer, hold = false;
  const vids = slides.map(x => x.querySelector("video"));
  const sync = () => {
    if (!sl.clientWidth) return;
    idx = Math.round(sl.scrollLeft / sl.clientWidth);
    dots.forEach((d,k) => d.classList.toggle("on", k===idx));
    vids.forEach((v,k) => { if (!v) return; if (k===idx) { v.play().catch(()=>{}); } else v.pause(); });
  };
  const go = n => { if (!sl.clientWidth) return; idx = (n + slides.length) % slides.length; sl.scrollTo({left: idx*sl.clientWidth, behavior:"smooth"}); };
  const auto = () => { clearInterval(timer); if (false) return; timer = setInterval(() => { if (!hold) go(idx+1); }, vids[0] ? 3400 : 2400); };
  let t; sl.addEventListener("scroll", () => { clearTimeout(t); t = setTimeout(sync, 80); }, {passive:true});
  w.querySelector(".prev").addEventListener("click", () => { go(idx-1); auto(); });
  w.querySelector(".next").addEventListener("click", () => { go(idx+1); auto(); });
  ["pointerenter","touchstart"].forEach(e => w.addEventListener(e, () => hold = true, {passive:true}));
  ["pointerleave","touchend"].forEach(e => w.addEventListener(e, () => { hold = false; auto(); }, {passive:true}));
  sync(); auto();
});

(function(){
  const box = document.getElementById("heroSlides"); if (!box) return;
  const imgs = [...box.querySelectorAll(".hs")], dots = [...box.querySelectorAll(".hs-dots button")];
  if (imgs.length < 2) return;
  let i = 0, t;
  const show = n => { i = (n + imgs.length) % imgs.length; imgs.forEach((im,k) => im.classList.toggle("on", k===i)); dots.forEach((d,k) => d.classList.toggle("on", k===i)); };
  const play = () => { clearInterval(t); t = setInterval(() => show(i+1), (C.hero.slideSeconds||5)*1000); };
  dots.forEach(d => d.addEventListener("click", () => { show(+d.dataset.i); play(); }));
  play();
})();
document.documentElement.classList.add("js");
const burger = document.getElementById("burger");
burger.addEventListener("click", () => { const o = document.body.classList.toggle("menu-open"); burger.setAttribute("aria-expanded", o); });
document.querySelectorAll(".drawer a").forEach(a => a.addEventListener("click", () => { document.body.classList.remove("menu-open"); burger.setAttribute("aria-expanded","false"); }));
const fix = document.getElementById("fixbar"), endSec = document.getElementById("contact");
addEventListener("scroll", () => {
  const r = endSec.getBoundingClientRect();
  fix.classList.toggle("show", scrollY > 600 && !(r.top < innerHeight && r.bottom > 0));
}, {passive:true});
/* 開いた中身は必ず表示 */
document.querySelectorAll("details").forEach(d => d.addEventListener("toggle", () => { if (d.open) setTimeout(() => d.querySelectorAll(".wait").forEach(x => x.classList.remove("wait")), 30); }));
/* ---------- プライバシーポリシー ---------- */
(function(){
  const m = document.getElementById("pp"); if (!m) return;
  let last;
  const open = () => { last = document.activeElement; m.hidden = false; document.body.classList.add("pp-lock"); m.querySelector(".pp-x").focus(); };
  const close = () => { m.hidden = true; document.body.classList.remove("pp-lock"); if (last) last.focus(); };
  document.querySelectorAll("[data-pp]").forEach(b => b.addEventListener("click", open));
  m.querySelectorAll("[data-ppclose]").forEach(b => b.addEventListener("click", close));
  addEventListener("keydown", e => { if (e.key === "Escape" && !m.hidden) close(); });
})();
/* ---------- 見出しを手で書く ---------- */
(function(){
  if (typeof HAND === "undefined" || false || !("IntersectionObserver" in window)) return;
  if (C.decor && C.decor.writing === false) return;
  const targets = [...document.querySelectorAll(".hero h1, .page-hero h1, .sec-head h2, .pf-sign")];
  const hand = document.createElement("img");
  hand.src = HAND.d; hand.alt = ""; hand.className = "writer-hand"; hand.setAttribute("aria-hidden", "true");
  document.body.appendChild(hand);
  const split = el => {
    const out = [], walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      const frag = document.createDocumentFragment();
      [...n.textContent].forEach(ch => { const sp = document.createElement("span"); sp.className = "wch"; sp.textContent = ch; frag.appendChild(sp); if (ch.trim()) out.push(sp); else sp.classList.add("on"); });
      n.parentNode.replaceChild(frag, n);
    });
    return out;
  };
  const place = (x, y) => {
    const w = hand.offsetWidth || 150, h = w * HAND.h / HAND.w;
    hand.style.transform = `translate3d(${x - w * HAND.tx}px, ${y - h * HAND.ty}px, 0) rotate(-4deg)`;
  };
  const q = []; let busy = false;
  const run = () => {
    const el = q.shift();
    if (!el) { busy = false; hand.classList.remove("show"); return; }
    busy = true;
    const cs = el._chars; let i = 0;
    const r0 = cs[0].getBoundingClientRect(); place(r0.left, r0.bottom - r0.height * .2);
    requestAnimationFrame(() => hand.classList.add("show"));
    const step = () => {
      if (i >= cs.length) { setTimeout(run, 250); return; }
      const c = cs[i++]; c.classList.add("on");
      const r = c.getBoundingClientRect();
      place(r.right, r.bottom - r.height * .2);
      setTimeout(step, 70);
    };
    setTimeout(step, 180);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { io.unobserve(e.target); q.push(e.target); if (!busy) run(); }
  }), { rootMargin: "0px 0px -20% 0px" });
  targets.forEach(el => {
    el.setAttribute("aria-label", el.textContent.trim());
    el._chars = split(el);
    if (!el._chars.length) return;
    el.classList.add("writing-ready");
    io.observe(el);
  });
})();
/* ---------- キャラクター：タップでぴょん・登場 ---------- */
document.querySelectorAll(".chara-w").forEach(w => {
  const go = () => { w.classList.remove("boing"); void w.offsetWidth; w.classList.add("boing"); };
  w.addEventListener("click", go);
  w.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") go(); });
  w.addEventListener("animationend", e => { if (e.animationName === "boing") w.classList.remove("boing"); }, true);
});
document.querySelectorAll(".services, .stats3, .pcards, .concerns, .reasons, .dc-steps, .prints, .acts, .fit ul, .flow").forEach(g => {
  [...g.children].forEach((c,i) => c.style.setProperty("--i", i % 6));
  g.classList.add("stg"); if (!g.classList.contains("rv")) g.classList.add("rv");
});
if ("IntersectionObserver" in window && !false){
  const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add("pop"); cio.unobserve(e.target); } }), {rootMargin:"0px 0px -10% 0px"});
  document.querySelectorAll(".chara-w").forEach(el => { if (el.getBoundingClientRect().top > innerHeight) cio.observe(el); });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.remove("wait"); io.unobserve(e.target); } }), {rootMargin:"0px 0px -8% 0px"});
  document.querySelectorAll(".rv").forEach(el => { if (el.getBoundingClientRect().top > innerHeight){ el.classList.add("wait"); io.observe(el); } });
}
