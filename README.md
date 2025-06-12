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
| **로그 조회**  | ![Desktop](https://github.com/user-attachments/assets/c30475eb-a3b5-49f9-8a1e-d8de772ad171) | ![Mobile](https://github.com/user-attachments/assets/fe3ab2b0-9f26-4af7-89ef-90ba1ad816c8) |
| **검색**        | ![Desktop](https://github.com/user-attachments/assets/21e554d6-091e-4a41-bf08-82fe5e6c896a) | ![Mobile](https://github.com/user-attachments/assets/7e692e57-bf7b-42a3-bd89-e1f6486ce8a7) |
| **상세 페이지** | ![Desktop](https://github.com/user-attachments/assets/d3a86dee-b6b2-4c49-83e3-93db3bc226be) | ⏳ |
| **로그 등록**  | ![Desktop](https://github.com/user-attachments/assets/c4a34b0a-39c6-4f46-993d-6e01aa18efbe) | ⏳ |
| **로그 수정**  | ![Desktop](https://github.com/user-attachments/assets/6c86cfea-c45d-42b2-9a6a-81737f262e8a) | ⏳ |
| **마이페이지** | ⏳ | ⏳ |

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
