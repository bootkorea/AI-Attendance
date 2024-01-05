# 태식이 (Take-A-Seat): AI 안면 인식 기능을 활용한 '자동 출석 확인' 웹서비스
#### 2023 JBNU 컴퓨터인공지능학부 작품경진대회 대상

## Description

AI 얼굴 인식 기능과 클라우드 자원을 활용한 '자동 출석 확인' 서비스를 웹 환경에서 이용할 수 있도록 구현한 서비스입니다.
학교, 기관 등 어느 조직에서나 쉽게 도입 가능하며, 기존 출석 방식의 한계 극복을 통해 효율적인 자원 활용이 가능하도록 지원합니다.

## Getting Started

### Prerequisites

- Node.js 및 npm 설치
- AWS 계정 및 설정된 AWS CLI

### Installation

1. Local 환경에 repository 를 Clone 합니다.
2. 이후, project directory 로 이동합니다.
3. 클라이언트에 필요한 의존성을 설치하기 위해 install_packages.sh 스크립트를 실행합니다:
   ```bash
   ./install_packages.sh
   ```
4. AWS 자격 증명 및 데이터베이스 구성을 위한 환경 변수 설정. 프로젝트 루트에 다음 변수를 포함하여 .env 파일을 생성합니다:
   ```env
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=your_aws_region
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_PORT=your_db_port
   DB_NAME=your_db_name
   ```

### Running the Application

애플리케이션을 실행하기 위해 다음 명령어를 사용하세요:

- 클라이언트: `client` 디렉토리로 이동하여 `npm start`를 실행합니다.
- 서버: `server` 디렉토리로 이동하여 `node server.js`를 실행합니다.

## 파일 구조

```
/Web-Services
|-- /client           # Client-side code
|   |-- /public       # Public assets
|   |-- /src          # Source files
|   |-- package.json  # Client dependencies
|-- /server           # Server-side code
|   |-- server.js     # Server setup and endpoints
|-- .gitignore        # Specifies intentionally untracked files to ignore
|-- install_packages.sh  # Script to install client dependencies
|-- README.md         # This file
```

## 기술 스택

| 분야             | 사용 기술                                        |
| ---------------- | ------------------------------------------------ |
| FrontEnd         | React, javascript                                |
| BackEnd          | Node.js, Express                                 |
| Database         | MySQL                                            |
| Face Recognition | AWS Rekognition                                  |
| Cloud Services   | Amazon EC2, Amazon RDS, Amason S3, Amazon Lambda |
| Tool             | VSCODE, Notion, Slack                            |
| Design           | Figma, CSS                                       |

## 아키텍처

## Developer Information

| 성명                                   | 역할                              |
| -------------------------------------- | --------------------------------- |
| [소부승](https://github.com/bootkorea) | BackEnd, Cloud Services, DevOps   |
| [신승헌](https://github.com/tlstmdgjs) | Face Recognition, Cloud Services  |
| [이정현](https://github.com/afpine)    | BackEnd, Database, Cloud Services |
| [지수인](https://github.com/sooinji)   | FrontEnd, Backend, Design         |

## 추가 사항

- `.env` 파일의 자리 표시자 값을 실제 AWS 및 데이터베이스 구성 세부 정보로 교체하세요.
- 애플리케이션을 실행하기 전에 모든 의존성이 올바르게 설치되었고 환경 변수가 설정되어 있는지 확인하세요.
