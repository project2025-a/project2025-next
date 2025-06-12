# Spoteditor (스팟에디터)

## 🗺️ About Spoteditor

**계획된 일정, 완벽한 하루**  

낯선 곳을 여행할 때마다 맛집, 액티비티, 주변 명소를 찾느라 한참을 검색하곤 했어요.  
만약 이 도시를 잘 아는 친구가 **내 코스를 계획해준다면?**  

**Spoteditor**는 사용자가 지도를 검색하여 여러 장소를 선택하고, 이미지와 설명을 추가해 하나의 ‘로그’ 단위로 발행하는 SNS 기반 웹 어플리케이션입니다.

</br>

## 📌 Service Features

1. **로그 등록**: 카카오 맵을 통해 장소를 선택하고, 이미지와 설명을 추가하여 나만의 로그를 작성할 수 있습니다.
2. **장소 검색 및 조회**: 검색어 입력 또는 셀렉트 박스를 활용하여 원하는 장소를 손쉽게 찾을 수 있습니다.
3. **커뮤니티 기능**: 북마크 및 팔로우 기능을 통해 관심 있는 유저, 장소, 로그를 마이페이지에서 간편하게 관리할 수 있습니다.
4. **반응형 디자인**: 데스크탑과 모바일에서 최적화된 UI/UX를 제공합니다.

</br>

## 🖥️ Demo

| Service          | Desktop | Mobile |
|-----------------|---------|--------|
| **로그 조회**  | ![Image](https://github.com/user-attachments/assets/49a60ab8-4763-4d80-aac0-6d9b94813dff) | ![Image](https://github.com/user-attachments/assets/193705da-7199-4b77-b4ad-ee70ec85b776) |
| **검색**        | ![Image](https://github.com/user-attachments/assets/b146f609-2de1-4c65-b8ca-053dff6cb23b) | ![Image](https://github.com/user-attachments/assets/2a673aa5-7d06-4461-8469-a767068ff63c) |
| **상세 페이지** | ![Image](https://github.com/user-attachments/assets/c631f3fa-2a1b-48c9-bf29-be1dd3900101) | ![Image](https://github.com/user-attachments/assets/5acccca9-7c00-4352-aedf-ed5b0fc487e8) |
| **로그 등록**  | ![Image](https://github.com/user-attachments/assets/ce700e70-ea4b-44ae-ad0f-acfd20c05874) | ![Image](https://github.com/user-attachments/assets/45e34b7f-4ecf-47ce-a63d-d16f8d128fcc) |
| **로그 수정**  | ![Desktop](https://github.com/user-attachments/assets/6c86cfea-c45d-42b2-9a6a-81737f262e8a) | ⏳ |
| **마이페이지** | ![Image](https://github.com/user-attachments/assets/d7e8b0c1-dc5d-423d-af15-131b754b6912) | ![Image](https://github.com/user-attachments/assets/c1266e57-fdc1-4463-9d02-2c58404148fc) |
| **유저 수정** | ![Image](https://github.com/user-attachments/assets/823b019f-37c5-4b64-9280-e30bbc128472) | ![Image](https://github.com/user-attachments/assets/32183a84-c4f6-4ef7-8464-53d9c8525a9e) |

</br>

## 🛠️ Tech Stack

- **Frontend**: React, TailwindCSS, Shadcn
- **State Management**: Zustand, Tanstack Query, React Hook Form, Zod
- **Backend**: Java, Spring Boot
- **Database**: AWS RDS
- **Map Service**: Kakao Maps API

</br>

## 📂 Folder Structure

```
📦 src
 ┣ 📂 assets       # 정적 파일 (이미지, 아이콘 등)
 ┣ 📂 components   # 공용 컴포넌트 (Icons, UI 등)
 ┣ 📂 constants    # 상수값 정의
 ┣ 📂 contexts     # React Context API 전역 상태 관리
 ┣ 📂 features     # 기능별 컴포넌트
 ┣ 📂 hooks        # 커스텀 훅
 ┃ ┣ 📂 mutations   # useMutation 관련 훅
 ┃ ┣ 📂 queries     # useQuery 관련 훅
 ┣ 📂 layouts      # 페이지 레이아웃 컴포넌트
 ┣ 📂 pages        # 페이지 컴포넌트 (각 페이지 전용 하위 컴포넌트 포함)
 ┣ 📂 routes       # 라우팅 관련 설정 (Protected Route 등)
 ┣ 📂 services     # API 호출 및 데이터 처리
 ┃ ┣ 📂 apis       # Axios 인스턴스 및 API 요청
 ┃ ┣ 📂 schemas    # Zod 유효성 검사 스키마
 ┣ 📂 store        # 클라이언트 상태 저장소 (Zustand)
 ┣ 📂 types        # 글로벌 타입 정의
 ┣ 📂 utils        # 유틸리티 함수
```

</br>

## 🚀 Getting Started

```bash
# 1. 프로젝트 클론
git clone https://github.com/your-repo/spoteditor.git

# 2. 의존성 설치
cd spoteditor
yarn install

# 3. 환경 변수 설정 (.env 파일 생성 후 아래 값 입력)
VITE_API_BASE_URL='백엔드 API 경로'
VITE_KAKAO_LOGIN_URL='카카오 로그인 URL'
VITE_KAKAO_MAP_KEY='카카오 맵 API 키'
VITE_CLOUDE_FRONT='AWS CloudFront URL'

# 4. 로컬 서버 실행
yarn start
```
