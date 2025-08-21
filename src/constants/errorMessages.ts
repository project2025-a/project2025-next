export const ERROR_MESSAGES = {
  COMMON: {
    INTERNAL_SERVER_ERROR: '서버 내부 오류가 발생했습니다.',
    EMPTY_RESULT: '조회 결과가 없습니다.',
    UNAUTHORIZED: '로그인이 필요합니다.',
    FORBIDDEN: '접근 권한이 없습니다.',
    BAD_REQUEST: '잘못된 요청입니다.',
    COORDINATES_REQUIRED: '위도와 경도 값이 필요합니다.',
    EXTERNAL_API_FAILED: '위치 정보를 가져오는 데 실패했습니다.',
    INVALID_RESPONSE: '유효하지 않은 응답 형식입니다.',
  },
  LOG: {
    NOT_FOUND: '해당 로그가 존재하지 않습니다.',
    LIST_EMPTY: '조회 가능한 로그들이 존재하지 않습니다.',
    CREATE_FAILED: '로그 생성에 실패했습니다.',
    DELETE_FAILED: '로그 삭제에 실패했습니다.',
    MISSING_ID: 'logId가 누락되었습니다.',
  },
  PLACE: {
    NOT_FOUND: '해당 장소가 존재하지 않습니다.',
    LIST_EMPTY: '조회 가능한 장소가 존재하지 않습니다.',
    CREATE_FAILED: '장소 생성에 실패했습니다.',
    DELETE_FAILED: '장소 삭제에 실패했습니다.',
    REVERSE_GEOCODE_FAILED: '좌표로부터 주소를 찾는 데 실패했습니다.',
    NO_ADDRESS_FOUND: '해당 좌표에 해당하는 주소를 찾을 수 없습니다.',
  },
  FOLLOW: {
    NOT_FOUND: '해당 팔로워가 존재하지 않습니다.',
    LIST_EMPTY: '조회 가능한 팔로워가 존재하지 않습니다.',
    CREATE_FAILED: '팔로우에 실패했습니다.',
    DELETE_FAILED: '팔로우에 실패했습니다.',
  },
  USER: {
    NOT_FOUND: '사용자 정보를 찾을 수 없습니다.',
    DELETE_FAILED: '회원 탈퇴에 실패했습니다.',
    DELETE_SUCCESS: '계정 삭제가 완료되었습니다.',
    ALREADY_DELETED: '삭제할 유저가 존재하지 않거나 이미 삭제되었습니다.',
  },
  SEARCH: {
    FAILED: '검색 결과 조회에 실패했습니다.',
    EMPTY: '검색 결과가 없습니다.',
  },
};

export const ERROR_MESSAGES_EN = {
  COMMON: {
    INTERNAL_SERVER_ERROR: 'An internal server error has occurred.',
    EMPTY_RESULT: 'No results found.',
    UNAUTHORIZED: 'Login is required.',
    FORBIDDEN: 'You do not have permission to access this resource.',
    BAD_REQUEST: 'Invalid request.',
    COORDINATES_REQUIRED: 'Latitude and longitude are required.',
    EXTERNAL_API_FAILED: 'Failed to retrieve location information.',
    INVALID_RESPONSE: 'Invalid response format.',
  },
  LOG: {
    NOT_FOUND: 'The specified log does not exist.',
    LIST_EMPTY: 'No available logs found.',
    CREATE_FAILED: 'Failed to create the log.',
    DELETE_FAILED: 'Failed to delete the log.',
    MISSING_ID: 'logId is missing.',
  },
  PLACE: {
    NOT_FOUND: 'The specified place does not exist.',
    LIST_EMPTY: 'No available places found.',
    CREATE_FAILED: 'Failed to create the place.',
    DELETE_FAILED: 'Failed to delete the place.',
    REVERSE_GEOCODE_FAILED: 'Failed to find address from coordinates.',
    NO_ADDRESS_FOUND: 'No address found for the specified coordinates.',
  },
  FOLLOW: {
    NOT_FOUND: 'The specified follower does not exist.',
    LIST_EMPTY: 'No available followers found.',
    CREATE_FAILED: 'Failed to follow.',
    DELETE_FAILED: 'Failed to unfollow.',
  },
  USER: {
    NOT_FOUND: 'User information not found.',
    DELETE_FAILED: 'Failed to delete the account.',
    DELETE_SUCCESS: 'Account deletion completed successfully.',
    ALREADY_DELETED: 'The user does not exist or has already been deleted.',
  },
  SEARCH: {
    FAILED: 'Failed to retrieve search results.',
    EMPTY: 'No search results found.',
  },
};
