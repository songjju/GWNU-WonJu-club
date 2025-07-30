describe('Validation Utils', () => {
  const validation = {
    isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    
    isPhoneNumber: (phone) => /^010-\d{4}-\d{4}$/.test(phone),
    
    isStudentId: (id) => /^\d{8}$/.test(id),
    
    isNotEmpty: (value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      return true; // 숫자나 boolean 등 다른 타입은 truthy 값이면 valid
    },
    
    minLength: (value, min) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.length === 0) return false;
      return value.toString().length >= min;
    },
    
    maxLength: (value, max) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.length === 0) return false;
      return value.toString().length <= max;
    }
  };

  test('이메일 유효성 검증이 올바르게 동작한다', () => {
    expect(validation.isEmail('test@example.com')).toBe(true);
    expect(validation.isEmail('invalid-email')).toBe(false);
    expect(validation.isEmail('')).toBe(false);
    expect(validation.isEmail('test@')).toBe(false);
  });

  test('전화번호 유효성 검증이 올바르게 동작한다', () => {
    expect(validation.isPhoneNumber('010-1234-5678')).toBe(true);
    expect(validation.isPhoneNumber('010-12345-678')).toBe(false);
    expect(validation.isPhoneNumber('02-1234-5678')).toBe(false);
    expect(validation.isPhoneNumber('')).toBe(false);
  });

  test('학번 유효성 검증이 올바르게 동작한다', () => {
    expect(validation.isStudentId('20240001')).toBe(true);
    expect(validation.isStudentId('2024001')).toBe(false);
    expect(validation.isStudentId('202400001')).toBe(false);
    expect(validation.isStudentId('abcd1234')).toBe(false);
  });

  test('빈 값 검증이 올바르게 동작한다', () => {
    expect(validation.isNotEmpty('test')).toBe(true);
    expect(validation.isNotEmpty('')).toBe(false);
    expect(validation.isNotEmpty('   ')).toBe(false);
    expect(validation.isNotEmpty(null)).toBe(false);
    expect(validation.isNotEmpty(undefined)).toBe(false);
    expect(validation.isNotEmpty(0)).toBe(true); // 숫자 0은 유효한 값
    expect(validation.isNotEmpty(false)).toBe(true); // boolean false는 유효한 값
  });

  test('최소 길이 검증이 올바르게 동작한다', () => {
    expect(validation.minLength('password', 8)).toBe(true);
    expect(validation.minLength('pass', 8)).toBe(false);
    expect(validation.minLength('', 1)).toBe(false);
    expect(validation.minLength(null, 1)).toBe(false);
    expect(validation.minLength(undefined, 1)).toBe(false);
  });

  test('최대 길이 검증이 올바르게 동작한다', () => {
    expect(validation.maxLength('short', 10)).toBe(true);
    expect(validation.maxLength('very long text', 10)).toBe(false);
    expect(validation.maxLength('', 10)).toBe(false);
    expect(validation.maxLength(null, 10)).toBe(false);
    expect(validation.maxLength(undefined, 10)).toBe(false);
  });
});