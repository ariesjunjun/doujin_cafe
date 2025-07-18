export default function QaPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">
        よくある質問
      </h1>

      <div className="space-y-8 text-text leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Q. トピックやコメントを削除できません。
          </h2>
          <p>
            投稿時と異なるIPアドレスやブラウザ、端末でアクセスした場合は削除できません。
            また、一定期間経つと任意での削除ができなくなります。
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            Q. 通報しても削除されません。
          </h2>
          <p>
            通報したからといって必ずしも削除されるわけではありません。
            一定の基準を満たす場合において、システムによる自動削除および
            目視での削除対応を行っています。
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            Q. 投稿制限がかかって、投稿できなくなりました。
          </h2>
          <p>
            規約違反や過去の通報実績等によって投稿制限をかけさせていただくことがあります。
            内容に問題がないにも関わらず何度も通報する行為も制限の対象になります。
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            Q. 機能を要望しているのに全然アップデートされません。
          </h2>
          <p>
            管理人が趣味で運営しているため、
            機能アップデートや改善はマイペースに行っています。
            使いやすいサービスを目指していますが、
            企業運営のように頻繁にアップデートはできないことをご了承ください。
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            Q. 広告が多いです。
          </h2>
          <p>
            継続的にサービスを運営するために必要な
            サーバー費用等を最低限捻出するために
            広告を設置させていただいております。
            できるだけ必要最小限に抑えますが、
            個人運営のためご了承ください。
          </p>
        </div>

        <div className="text-sm text-gray-500 mt-10 text-center">
          DOUJIN CAFE 管理人：ユズハ
        </div>
      </div>
    </div>
  );
}
