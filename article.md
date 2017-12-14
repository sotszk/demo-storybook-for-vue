# Storybook for Vue 入門

## はじめに

筆者が今携わっているプロジェクトでは Vue.js（以後は Vue）が使われています。

そのプロジェクトで一度 「Storybook」 というツールを導入しようとしたことがありました。結局導入は見送ることになりましたが、その時に Storybook に良い手応えを感じたため、あらためて簡単なプロジェクトを作り Storybook を試してみました。

下記がデモです。

- [デモ 1（プロジェクト）](https://sotasuzuki.github.io/demo-storybook-for-vue/demos/app/)
- [デモ 2（プロジェクトの Storybook）](https://sotasuzuki.github.io/demo-storybook-for-vue/demos/storybook/)

Storybook 自体まだまだ新しいプロジェクトのため、ネット上にも情報は多くありません。この記事を読み Storybook に興味を持ってくれる人が増え、ネット上に Storybook の情報が増えていけばいいな、と思います。


### この記事の対象読者

- Vue を使って開発をしている人 / する予定のある人 / 興味のある人
- Vue のプロジェクトで UI コンポーネントの管理をより良くしたいモチベーションがある人
- React で Storybook を使ったことがあり、Vue でも Storybook を使ってみたい人

### 前提とする知識

- コマンドラインで npm （か yarn）を使ったことがある
- Vue の単一ファイルコンポーネント（.vue）を使って Vue コンポーネントを作ったことがある

### この記事を読むとどうなるか

- Storybook がどんなものかある程度わかる
- Storybook for Vue で具体的にどんなことができるかわかる
- 既存 / 新規の Vue プロジェクトへの Storybook を導入方法がわかる


## Storybook とは
![Screenshot 2017-12-02 17.38.57.png](https://qiita-image-store.s3.amazonaws.com/0/73074/4b48454b-682b-6e6f-9123-c5da4c3c934d.png "Screenshot 2017-12-02 17.38.57.png")


Storybook は React, React Native Web, Vue 向けの UI 開発環境です。サンドボックス環境を構築し、その中でコンポーネントがどのような挙動をするのかテストできたり、コンポーネントを一望できるスタイルガイドのように使えたりします。

[こちら](https://storybook.js.org/)が公式です。もともと React ユーザに向けて開発されたものですが、[v3.2.0](https://github.com/storybooks/storybook/releases/tag/v3.2.0) から Vue がサポートされました。現在の最新バージョンは [v3.3.0-alpha.4](https://github.com/storybooks/storybook/releases/tag/v3.3.0-alpha.4) です。この記事で作るサンプルでは最新バージョンを使ってみました。

### 何に使えるか

Storybook の主だった使いみちとしては下記のようなものがあると思われます。

- 自作コンポーネントのライブラリー（一覧）や状態込みのスタイルガイド
- ページを作っている時に適切なコンポーネントを素早く選び出す
- 開発中・開発後にコンポーネントの UI をテストする
- コンポーネントや API のドキュメント
- エンジニアやデザイナー間のコミュニケーション
- アプリケーションの仕様書

作り込めばこんなのもできるようです。

- [React Native Web の Storybook](https://necolas.github.io/react-native-web/storybook/)
- [Coursera の Storybook](https://building.coursera.org/coursera-ui/)


公式のサンプル集は[こちら](https://storybook.js.org/examples/)。



### 用語の紹介

| 用語 | 説明     |
| :------------- | :------------- |
| Storybook   | 2つの意味で使っています。1つは [Storybook](https://github.com/storybooks/storybook) それ自体のこと。もう1つは Storybook が生成してくれるページのことです。
| Story       | これも2つの意味で使っています。`StoriesOf().add()` でコンポーネントを登録すると作られるもの、または `add()`の中身を Story と読んでいます。 |

## Storybook の導入

Vue CLI のプロジェクトで Storybook を使ってみます。

今回は、Vue CLI プロジェクトへの Storybook のセットアップから、出来上がった Storybook を静的サイトとしてビルドするところまでをハンズオンします。


ディレクトリ構成は下記を想定して進めていきます。
※一部割愛しています。

```
.storybook/
	addons.js
	config.js
src/
	assets/
	components/
	stories/
	App.vue
	main.js
storybook-static/
package.json
webpack.config.js
```


パッケージマネージャは npm を使っていきます。

### セットアップ

#### Vue CLI プロジェクトのセットアップ

既存のプロジェクトに Storybook を導入する場合は不要です。

```
# Vue CLI のインストール
$ npm i -g vue-cli

# プロジェクトディレクトリへ移動
$ cd your-awesome-project

# Vue CLI で webpack-simple テンプレートを使って init 。質問は全部 Enter で OK
$ vue init webpack-simple

# 依存パッケージのインストール
$ npm i
```

#### Storybook for Vue のセットアップ

公式の [Quick Start Guide](https://storybook.js.org/basics/quick-start-guide/) では、グローバルに Storybook をインストールして `getstorybook` コマンド を叩くというやり方を紹介していますが、今回は [Slow start guide](https://storybook.js.org/basics/slow-start-guide/) に沿って進めていくため、グローバルに Storybook をインストールする必要はありません。

```
# Storybook for Vue のインストール
$ npm i -D @storybook/vue
```

次に `package.json` に Storybook 用のコマンドを追加します。

```json
{
  "scripts": {
    ... other commands ...

    "storybook": "start-storybook -p 9001 -c .storybook",
    "buid-storybook": "build-storybook -s public"
  }
}
```

次は Storybook の設定ファイルを作成していきます。さきほど追加した `storybook` コマンドでは `-c .storybook` というオプションを指定していますがこれは Storybook の設定ファイルの置かれているディレクトリを指定しています。

まず`.storybook` ディレクトリを作成し、その中に `config.js` を置きます。

```js:config.js
import { configure } from '@storybook/vue'

import Vue from 'vue'

function loadStories () {
  require('./../src/stories')
}

configure(loadStories, module)
```

### Story を書いてみる

さきほど作成した `.storybook/config.js` の `loadStories` 関数で読み込んでいるファイルを作成していきます。

まずは、なんでもいいのでコンポーネントを用意します。（今回は MyButton を使用）

次に `src/stories` ディレクトリを作成し、その中に `index.js` を置きます。そこに簡単な Story を書いてみましょう。

```js:index.js
import { storiesOf } from '@storybook/vue'

import MyButton from './../components/MyButton.vue'

storiesOf('MyButton', module)
  .add('simple', () => {
    components: { MyButton },
    template: `<MyButton>KEEP IT SIMPLE</MyButton>`
  })
```

#### Storybook をブラウザで確認する

```
# package.json に追加した storybook コマンドを走らせる
$ npm run storybook

$ start-storybook -p 9001 -c .storybook
@storybook/vue v3.2.16

=> Loading custom .babelrc
=> Loading custom addons config.
=> Using default webpack setup based on "vue-cli".
webpack built 0a82d10292feee5981cd in 6014ms
Storybook started on => http://localhost:9001/
```

http://localhost:9001/ を開くと、さきほど書いた Story が Storybook で確認できるはずです。とはいえコンポーネントが配置されてあるだけですが。

ちなみにホットリローディングもついているので、コマンドを走らせたまま Story を書きすすめていくと効率良く開発できそうです。

### Storybook Addons を使う

さきほど作ったサンプルはいささかシンプル過ぎるため、Storybook Addons を使って Story を拡張していきます。

Storybook にはコンポーネントのテストや Storybook の UI をカスタマイズをするためのアドオンが多数用意されています。（Storybook for Vue では一部対応していないアドオンもあります）

#### アドオンをインストールする

`@storybook/vue` とは別でアドオンをインストールする必要があります。

```
// Links と Knobs と Centered というアドオンをインストールする
$ npm i -D @storybook/addon-links @storybook/addon-knobs @storybook/addon-centered
```

#### 設定ファイルにアドオンを登録する

`.storybook` ディレクトリに `addons.js` を置き、使用したいアドオンを登録します。

```js:addons.js
import '@storybook/addon-links/register'
import '@storybook/addon-knobs/register'
// Centered は登録する必要はない。登録する必要があるかどうかはアドオンによるようだ。
```

#### アドオンを使って Story を書く

`src/stories/index.js` にアドオンをインポートさせます。

```js:index.js
import { linkTo } from '@storybook/addon-links'
import { withNotes } from '@storybook/addon-notes'
import { withKnobs, text, color } from '@storybook/addon-knobs'
import Centered from '@storybook/addon-centered'
```

Story を書きます。アドオンでサンプルに下記の機能を追加しています。

- Knobs を使いボタンの背景色とラベルを変更
- LinkTo を使いコンポーネント間を遷移
- Centered を使いコンポーネントをページ中央に配置

```
storiesOf('MyButton', module)
  .addDecorator(Centered)
  .addDecorator(withKnobs)
  .add('with some Addons', () => {
    const label = text('Label', 'BUTTON')
    const color = color('Color', '#3c3c3c')
    return {
      components: { MyButton },
      template: `
        <div>
          <p>You can change the button label by touching widgets in a KNOBS tab.</p>
          <MyButton
            style="background-color: ${color}"
            @click="handleClick"
           >${label}</MyButton>
        </div>
      `,
      methods: {
      	handleClick: linkTo('SomeComponent')
      },
    }
  })

storiesOf('SomeComponent', module)
  .add('hoge', () => ({
    template: `<div>HOGE</di>`
  }))
```

Knobs はページ下部の専用UIを操作して `template` 内の値を動的に変更できます。`v-bind:` 属性内で使うと上手くいかないため、 正直 Vue との相性は良くない感じはしました。

Knobs にしろ LinkTo にしろ Actions もそうなんですが Storybook Addons は全体的に癖が強い印象を受けました。


### Storybook で Vuex を使う

まずは設定ファイルに Vuex をインポートさせる必要があります。

```js:config.js
import { configure } from '@storybook/vue'

import Vue from 'vue'
import Vuex from 'vuex' // 追加

Vue.use(Vuex) // 追加

function loadStories () {
  require('./../src/stories')
}

configure(loadStories, module)

```

Storybook で Vuex を使うには、Story 内で Vuex Store を読み込ませるようなことが必要です。

下記のコードはボタンを押すと下のテキストの色が変わるサンプルです。

```js:index.js
storiesOf('MyButton', module)
  .addDecorator(Centered)
  .add('with Vuex', () => ({
    components: {
      MyButton,
    },
    template: `
      <div>
        <MyButton @click="handleClick">Change Color</MyButton>
        <p :style="{'color': color}">テキスト</p>
      </div>
    `,
    store: new Vuex.Store({
      state: {
        color: 'black'
      },
      actions: {
        changeColor (context, color) {
          context.commit('setColor', color)
        },
      },
      mutations: {
        setColor (state, color) {
          state.color = color
        },
      },
    }),
    methods: {
      handleClick () {
        let newColor
        const num = Math.random() * 100
        if (num <= 25) {
          newColor = 'blue'
        } else if (num <= 50) {
          newColor = 'red'
        } else if (num <= 75) {
          newColor = 'orange'
        } else {
          newColor = 'black'
        }
        this.$store.dispatch('changeColor', newColor)
      },
    },
    computed: {
      color () {
        return this.$store.state.color
      },
    },
  }))
```

Store を外部ファイル化するなど、改良の余地が大きそうです。


### Storybook Router を使う

Vue Router のラッパーのようです。ちゃんとは検証はしておりませんが、Storybook Router を使った簡単なコードを載せます。
Storybook 内でページの遷移を確認したいときなどに使えそうです。

```vue:MyNavbar.vue
<template>
  <div>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
  </div>
</template>

<script>
export default {
  name: 'MyNavbar'
}
</script>
```

```js:index.js
import { storiesOf } from '@storybook/vue'
import StoryRouter from 'storybook-router'

const Top = {
  template: `<div>Top</div>`
}

const About = {
  template: `<div>About</div>`
}

import MyNavbar from './../components/MyNavbar.vue'

storiesOf('MyNavbar', module)
  .addDecorator(StoryRouter({}, {
    routes: [
      { path: '/', component: Top },
      { path: '/about', component: About },
    ],
  }))
  .add('with Story Router', () => ({
    components: { MyNavbar },
    template: `
      <div>
        <MyNavbar/>
        <router-view/>
      </div>
    `,
  }))
```

これも改良の余地が大分ありそうですが、ちょっと今回はまってしまったのでまた時間のあるときに改良したいと思います。


### Storybook を静的サイトとしてビルドする

これで最後になります。作成した Storybook を静的サイトとしてビルドします。

ビルドするには、はじめに `package.json` に追加した `buid-storybook` コマンドを使います。

```
$ npm run build-storybook

@storybook/vue v3.2.16

=> Loading custom .babelrc
=> Loading custom addons config.
=> Using default webpack setup based on "vue-cli".
Building storybook ...
✨  Done in 18.82s.
```

デフォルトでは `storybook-static/` というディレクトリにビルドされたファイルが生成されます。


ハンズオンは以上です。ソースは GitHub 上にアップしております。

https://github.com/SotaSuzuki/demo-storybook-for-vue/tree/master

※本記事に載せているサンプルコードとは一部相違がございます。

## Storybook Addons の紹介

Storybook の主要なアドオンを簡単に紹介します。一部 Vue に対応していないものもあります。

### Actions

- コンポーネントのイベントを「Action Logger」パネルでロギング（記録）する

### Links

- コンポーネント間の遷移を可能にする

### Knobs

- コンポーネントのプロパティを Storybook 上で動的に変更するための UI ウィジェット（フォームパーツみたいなもの）を配置できるようにする
- Color picker や Date picker、 Slider など様々な種類の UI ウィジェットが用意されている

### Notes

- Story の説明を HTML で記述できる

### Centered

- コンポーネントを storybook コンテンツエリアの中央に配置する

### Options

- Storybook 自体の UI をカスタマイズできる

### Info

- Story にソースコード、説明、Reactプロパティの型などの情報を追加する
- Notes addon の強力版

※ 2017.12.2 時点では Vue には未対応

### Storyshots

- Story で Jest スナップショットテストを実行する

※ 2017.12.2 時点では Vue には未対応

## まとめ

Storybook for Vue は機能的にも発展途上で、現段階では一定以上の規模のプロジェクトで導入するのは難しいかもしれません。まだ Vue をサポートして間もないですからね・・。

ただ、はっきり言って Storybook のポテンシャルはものすごく高いです。開発も活発ですし、将来的にはコンポーネントベースの開発にはかかせないツールになってもおかしくはないと、個人的には思ってます。

## 参考

- [Storybook for Vueのことはじめ](http://blog.miyanokomiya.tokyo/storybook-for-vuenokotohazime/)
- [Vue on Storybook by kazupon](http://sssslide.com/speakerdeck.com/kazupon/vue-on-storybook)
- [UI開発の流れが変わる！React Storybookでデザイナーも開発者も幸せになれる](https://www.webprofessional.jp/react-storybook-develop-beautiful-user-interfaces-with-ease/)
- [React Storybook入門：コンポーネントカタログがさくさく作れちゃうかもしれないオシャレサンドボックス環境](https://qiita.com/beijaflor/items/4fc01f8d557c1926c38d)
