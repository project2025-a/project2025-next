import NoticeHeader from '@/components/features/notice/NoticeHeader';

export default function PrivacyPage() {
  return (
    <main className="flex justify-center w-full">
      <div className="max-w-[724px] w-full">
        <NoticeHeader title="개인정보 처리방침" />
        <section className="px-4 py-10 text-text-sm text-light-600 space-y-6">
          <p>
            킷폼(Kitform)은 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 등 관련
            법령상의 개인정보보호 규정을 준수하며, 정보주체의 자유와 권리 보호를 위해 적법하게
            개인정보를 처리하고 안전하게 관리하고 있습니다. 이에 개인정보보호법 제30조에 따라
            정보주체에게 개인정보의 처리와 보호에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을
            신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을
            수립·공개합니다.
          </p>

          {/* 제1조 */}
          <h3 className="font-semibold">제1조 (개인정보의 처리목적)</h3>
          <p>
            킷폼은 다음의 목적을 위하여 개인정보를 처리하고 있으며, 수집된 개인정보는 다음의 목적
            이외의 용도로는 이용되지 않습니다. 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에
            따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ul className="pl-5 space-y-1">
            <li>
              ① 서비스 제공 및 계약의 이행 일코스 공유 플랫폼 서비스 제공, 컨텐츠 제공, 사용자
              맞춤형 서비스 제공, 본인인증, 서비스 이용 통계분석을 목적으로 개인정보를 처리합니다.
            </li>
            <li>
              ② 회원 관리 회원가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격
              유지·관리, 서비스 부정이용 방지 및 비인가 사용 방지, 각종 고지·통지, 고충처리를
              목적으로 개인정보를 처리합니다.
            </li>
            <li>
              ③ 마케팅 활용 신규 서비스 개발 및 맞춤 서비스 제공, 통계학적 특성에 따른 서비스 제공
              및 광고 게재, 서비스의 유효성 확인, 이벤트 및 광고성 정보 제공(명백한 거부의사 표시에
              따른 프로필 기반 광고 차단 포함)을 목적으로 개인정보를 처리합니다.
            </li>
            <li>
              ④ 서비스 개선 서비스 이용에 대한 분석, 서비스 개선 및 이용권 관리, 서비스 오류 및 장애
              대응, 서비스 이용 통계 분석을 목적으로 개인정보를 처리합니다.
            </li>
          </ul>

          {/* 제2조 */}
          <h3 className="font-semibold">제2조 (수집하는 개인정보의 항목)</h3>
          <p>킷폼이 처리하는 개인정보의 항목은 다음과 같습니다.</p>
          <ul className="pl-5 space-y-1">
            <li>
              ① 필수항목 회원가입 시 이메일 주소, 닉네임, 프로필 사진, 출생연도를 수집합니다. <br />
              이러한 정보는 서비스 이용을 위해 필수적으로 수집되는 정보입니다.
            </li>
            <li>
              ② 선택항목 주소 정보를 선택적으로 수집하며, 사용자의 동의 하에 추가적인 서비스 이용을
              위해 수집될 수 있습니다.
            </li>
            <li>
              ③ 자동수집정보 서비스 이용 과정에서 쿠키, IP 주소, 사용자 위치 정보(일시적), 서비스
              이용기록, 접속 로그, 기기정보 등이 자동으로 수집될 수 있습니다.
            </li>
            <li>
              ④ 소셜로그인 연동 시 수집정보 카카오 및 구글 등 소셜로그인 서비스 이용 시 해당 소셜
              미디어로부터 이메일, 닉네임, 프로필 사진, 출생연도를 수집합니다.
            </li>
          </ul>

          {/* 제3조 */}
          <h3 className="font-semibold">제3조 (개인정보의 수집방법)</h3>
          <p>킷폼은 다음과 같은 방법으로 개인정보를 수집합니다.</p>
          <ul className="pl-5 space-y-1">
            <li>
              ① 카카오, 구글 등 소셜로그인을 통한 회원가입 및 서비스 이용 과정에서 이용자가 제공하는
              방법
            </li>
            <li>② 서비스 이용 과정에서 자동으로 생성되어 수집되는 방법</li>
            <li>③ 이벤트나 프로모션 참여 과정에서 수집하는 방법(향후 이벤트 진행 시)</li>
          </ul>

          {/* 제4조 */}
          <h3 className="font-semibold">제4조 (개인정보의 이용 및 보유 기간)</h3>
          <p>
            킷폼은 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시에
            동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.
          </p>
          <ul className="pl-5 space-y-1">
            <li>
              ① 회원 탈퇴 시까지 개인정보를 보관하며, 탈퇴 시 데이터베이스에서 즉시 일괄 삭제됩니다.
            </li>
            <li>② 장기 미이용자 정보도 회원 탈퇴와 동일하게 처리됩니다.</li>
            <li>③ 관계 법령에 따라 보존하여야 하는 개인정보의 항목은 현재 없습니다.</li>
          </ul>

          {/* 제5조 */}
          <h3 className="font-semibold">제5조 (개인정보의 제3자 제공)</h3>
          <p>킷폼은 다음의 경우를 제외하고는 정보주체의 개인정보를 제3자에게 제공하지 않습니다.</p>
          <ul className="pl-5 space-y-1">
            <li>① 정보주체로부터 별도의 동의를 받은 경우</li>
            <li>
              ② 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의
              요구가 있는 경우
            </li>
          </ul>
          <p>현재 킷폼은 제3자에게 개인정보를 제공하고 있지 않습니다.</p>

          {/* 제6조 */}
          <h3 className="font-semibold">제6조 (개인정보 처리업무의 위탁)</h3>
          <p>
            킷폼은 현재 개인정보 처리 업무를 외부에 위탁하고 있지 않습니다. 향후 업무 효율성 및
            서비스 품질향상 등을 위해 개인정보 처리업무를 위탁할 수 있으며, 이 경우 관련 법령에 따라
            위탁계약 체결 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고, 수탁자가
            개인정보를 안전하게 처리하는지를 감독하겠습니다.
          </p>

          {/* 제7조 */}
          <h3 className="font-semibold">
            제7조 (정보주체와 법정대리인의 권리·의무 및 그 행사방법)
          </h3>
          <ul className="pl-5 space-y-1">
            <li>
              ① 정보주체는 킷폼에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수
              있습니다:
              <ul className="list-disc pl-5 mt-1">
                <li>개인정보 열람요구</li>
                <li>오류 등이 있을 경우 정정 요구</li>
                <li>삭제요구</li>
                <li>처리정지 요구</li>
              </ul>
            </li>
            <li>
              ② 제1항에 따른 권리 행사는 개인정보보호법 시행령 제41조제1항에 따라 서면, 전자우편,
              모사전송(FAX) 등을 통하여 하실 수 있으며, 킷폼은 이에 대해 지체 없이 조치하겠습니다.
            </li>
            <li>
              ③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여
              하실 수 있습니다. 이 경우 개인정보보호법 시행규칙 별지 제11호 서식에 따른 위임장을
              제출하셔야 합니다.
            </li>
            <li>
              ④ 현재 14세 미만 미성년자도 서비스 이용이 가능하나, 빠른 시일 내에 이용 정책을
              변경하여 14세 이상만 서비스를 이용할 수 있도록 할 예정입니다.
            </li>
          </ul>

          {/* 제8조 */}
          <h3 className="font-semibold">제8조 (개인정보의 파기)</h3>
          <p>
            킷폼은 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
            지체 없이 해당 개인정보를 파기합니다.
          </p>
          <ul className="pl-5 space-y-1">
            <li>
              ① 파기절차 파기하여야 하는 개인정보에 대해 개인정보 파기계획을 수립하여 파기합니다.
            </li>
            <li>
              ② 파기방법 전자적 파일 형태의 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여
              삭제하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
            </li>
            <li>③ 회원 탈퇴 시 데이터베이스에서 즉시 일괄 삭제되며, 임시 보관 기능은 없습니다.</li>
          </ul>

          {/* 제9조 */}
          <h3 className="font-semibold">제9조 (개인정보의 안전성 확보 조치)</h3>
          <p>
            킷폼은 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한
            기술적·관리적·물리적 조치를 하고 있습니다.
          </p>
          <ul className="pl-5 space-y-1">
            <li>
              ① 개인정보 취급 직원의 최소화 및 교육 개인정보를 취급하는 직원을 지정하고 담당자에
              한정시켜 최소화하여 개인정보를 관리하는 대책을 시행하고 있습니다.
            </li>
            <li>
              ② 개인정보에 대한 접근 제한 AWS 보안그룹 설정, IP별 접근 제한 등 개인정보처리시스템에
              대한 접근권한의 부여, 변경, 말소를 통하여 개인정보에 대한 접근통제를 필요적 조치하고
              있으며 침입방지시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있습니다.
            </li>
            <li>
              ③ 접속기록의 보관 및 위변조 방지 개인정보처리시스템에 접속한 기록을 최소 6개월 이상
              보관, 관리하고 있으며, 접속기록이 위변조 및 도난, 분실되지 않도록 보안기능을 사용하고
              있습니다.
            </li>
            <li>
              ④ 개인정보의 암호화 현재 암호화가 필요한 중요 개인정보는 없으나, 향후 필요시 암호화
              조치를 실시할 예정입니다.
            </li>
            <li>
              ⑤ 보안프로그램 설치 및 갱신 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을
              막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하고 있습니다.
            </li>
          </ul>

          {/* 제10조 */}
          <h3 className="font-semibold">제10조 (개인정보 자동 수집 장치)</h3>
          <ul className="pl-5 space-y-1">
            <li>
              ① 킷폼은 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로
              불러오는 &lsquo;쿠키(cookie)&lsquo;를 사용합니다.
            </li>
            <li>
              ② 쿠키의 사용목적
              <ul className="list-disc pl-5 mt-1">
                <li>로그인/로그아웃 처리 시 사용</li>
                <li>IP 중복 방지 차단</li>
                <li>서비스 이용 통계 분석</li>
              </ul>
            </li>
            <li>
              ③ 쿠키 설정 거부 방법 현재 별도의 쿠키 거부 방법을 제공하고 있지 않으나, 웹브라우저
              설정을 통해 쿠키 저장을 거부할 수 있습니다.
            </li>
            <li>
              ④ 쿠키 저장을 거부할 경우 컨텐츠 등록, 유저 팔로우 기능, 컨텐츠 북마크 기능 등 일부
              서비스 이용에 제한이 있을 수 있습니다.
            </li>
          </ul>

          {/* 제11조 */}
          <h3 className="font-semibold">제11조 (개인정보 보호책임자)</h3>
          <ul className="pl-5 space-y-1">
            <li>
              ① 킷폼은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
              정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고
              있습니다.
            </li>
            <li>
              ② 개인정보 보호책임자
              <ul className="list-disc pl-5 mt-1">
                <li>성명: 장다혜</li>
                <li>연락처: 010-5092-9069</li>
                <li>이메일: 서비스 내 문의하기를 통해 고객센터로 문의</li>
              </ul>
            </li>
            <li>
              ③ 정보주체께서는 킷폼의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의,
              불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다.
              킷폼은 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.
            </li>
          </ul>

          {/* 제12조 */}
          <h3 className="font-semibold">제12조 (권익침해 구제방법)</h3>
          <p>
            정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보 분쟁조정위원회,
            한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이
            밖에 기타 개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.
          </p>
          <ul className="pl-5 space-y-1">
            <li>① 개인정보 분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)</li>
            <li>② 개인정보침해 신고센터: (국번없이) 118 (privacy.kisa.or.kr)</li>
            <li>③ 대검찰청: (국번없이) 1301 (www.spo.go.kr)</li>
            <li>④ 경찰청: (국번없이) 182 (cyberbureau.police.go.kr)</li>
          </ul>

          {/* 제13조 */}
          <h3 className="font-semibold">제13조 (위치정보 이용)</h3>
          <ul className="pl-5 space-y-1">
            <li>
              ① 킷폼은 위치기반 컨텐츠 등록 시 이용자의 동의를 받아 일시적으로 위치정보를 활용하여
              장소를 검색할 수 있도록 하고 있습니다.
            </li>
            <li>
              ② 위치정보는 로그 등록 시에만 필요한 경우 일시적으로 사용되며, 사용자의 위치정보를
              보관하거나 보유하지 않습니다.
            </li>
            <li>③ 제3자에게 위치정보를 제공하지 않습니다.</li>
          </ul>

          {/* 제14조 */}
          <h3 className="font-semibold">제14조 (개인정보 처리방침 변경)</h3>
          <ul className="pl-5 space-y-1">
            <li>① 이 개인정보 처리방침은 2025년 6월 9일부터 적용됩니다.</li>
            <li>
              ② 개인정보 처리방침이 변경되는 경우 변경사항의 시행 7일 전부터 서비스 내 공지사항을
              통하여 고지할 것입니다.
            </li>
            <li>
              ③ 중요한 변경이 있을 경우에는 최소 30일 전에 고지하고, 필요시 개별 고지를 할 수
              있습니다.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
