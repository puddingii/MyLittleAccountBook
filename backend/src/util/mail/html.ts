const STYLE = {
	mainColor: '#02c5f6',
};

const coverDefaultTemplate = (
	mainwords: string,
	restTitle: string,
	component: string,
) => {
	return `
<div
  style="
    font-family: 'Apple SD Gothic Neo', 'sans-serif' !important;
    width: 540px;
    height: 600px;
    border-top: 4px solid ${STYLE.mainColor};
    margin: 100px auto;
    padding: 30px 0;
    box-sizing: border-box;
  "
>
  <h1 style="margin: 0; padding: 0 5px; font-size: 28px; font-weight: 400">
    <span style="font-size: 15px; margin: 0 0 10px 3px">나의 작은 가계부</span><br />
    <span style="color: ${STYLE.mainColor}">${mainwords}</span>${restTitle}.
  </h1>
  ${component}
</div>
	`;
};

export const getVerifyMailHTML = (href: string, nickname: string) => {
	const mainContent = `
	<p style="font-size: 16px; line-height: 26px; margin-top: 50px; padding: 0 5px">
    안녕하세요.<br />
    ${nickname}님 "나의 작은 가계부"에 가입해 주셔서 감사드립니다.<br />
    아래 <b style="color: ${STYLE.mainColor}">'메일 인증'</b> 버튼을 클릭하여 회원가입을 완료해
    주세요.<br />
		아래의 메일 인증 링크는 10분간 유효하며 1일 5회 제한이 되어있습니다.
    감사합니다.
  </p>

  <a
    style="color: #fff; text-decoration: none; text-align: center"
    href="${href}"
    target="_blank"
    ><p
      style="
        display: inline-block;
        width: 210px;
        height: 45px;
        background: ${STYLE.mainColor};
        line-height: 45px;
        vertical-align: middle;
        font-size: 16px;
      "
    >
      메일 인증
    </p>
	</a>

  <div style="border-top: 1px solid #ddd; padding: 5px">
    <p style="font-size: 13px; line-height: 21px; color: #555">
      만약 버튼이 정상적으로 클릭되지 않는다면, 아래 링크를 복사하여 접속해 주세요.<br />
      ${href}
    </p>
  </div>`;

	return coverDefaultTemplate('메일인증', ' 안내', mainContent);
};

export const getFindPWHTML = (tempPw: string) => {
	const mainContent = `
	<p style="font-size: 16px; line-height: 26px; margin-top: 50px; padding: 0 5px">
    안녕하세요.<br />
    요청하신 임시 비밀번호가 생성되었습니다.<br />
    아래의 <b style="color: ${STYLE.mainColor}">'임시 비밀번호'</b> 로
    로그인하세요.<br />
    감사합니다.
  </p>

  <p style="font-size: 16px; margin: 40px 5px 20px; line-height: 28px">
    임시 비밀번호: <br />
    <span style="font-size: 24px">${tempPw}</span>
  </p>
  <a
    style="color: #fff; text-decoration: none; text-align: center"
    href="https://puddingii.xyz/login"
    target="_blank"
    ><p
      style="
        display: inline-block;
        width: 210px;
        height: 45px;
        margin: 30px 5px 40px;
        background: ${STYLE.mainColor};
        line-height: 45px;
        vertical-align: middle;
        font-size: 16px;
      "
    >
      로그인하러 가기
    </p></a
  >

  <div style="border-top: 1px solid #ddd; padding: 5px">
    <p style="font-size: 13px; line-height: 21px; color: #555">
      만약 버튼이 정상적으로 클릭되지 않는다면, 아래 링크를 복사하여 접속해 주세요.<br />
      https://puddingii.xyz/login
    </p>
  </div>`;

	return coverDefaultTemplate('임시 비밀번호', ' 발급안내', mainContent);
};
