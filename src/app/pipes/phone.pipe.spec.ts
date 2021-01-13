import { PhonePipe } from './phone.pipe';

describe('PhonePipe', () => {
  it('create an instance', () => {
    const pipe = new PhonePipe();
    expect(pipe).toBeTruthy();
  });

  it('should beautify the phone string', () => {
    const pipe = new PhonePipe();
    const phoneString = '+71231234567';

    expect(pipe.transform(phoneString)).toBe('+7 (123) 123-45-67');
  });

  it('should not beautify strings which length is more then 12', () => {
    const pipe = new PhonePipe();
    const phoneString = '+712312345674';

    expect(pipe.transform(phoneString)).toBe('+712312345674');
  });
});
