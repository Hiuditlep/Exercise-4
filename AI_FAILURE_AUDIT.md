# AI FAILURE MODE AUDIT REPORT — LAB 04

## Phân tích phản mẫu (Anti-Patterns), lỗ hổng bất đồng bộ và bảo mật API trong kiến trúc SPA

---

## 1. Vulnerability 01: Chuỗi useEffect đồng bộ dây chuyền (Cascading Re-renders & Infinite Loop)

### 1.1. Ngữ cảnh & Mã nguồn lỗi do AI đề xuất (Exercise 1.3)

- **Prompt gửi AI**: _"Tạo form đăng ký có kiểm tra lỗi từng ô input và cập nhật trạng thái hợp lệ của toàn bộ form."_
- **Đoạn mã phản mẫu do AI sinh ra**:

  ```javascript
  function LegacyForm() {
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [isValid, setIsValid] = useState(false);

    // Anti-pattern: Dùng useEffect đồng bộ state con -> state cha
    useEffect(() => {
      setNameError(name.length < 3 ? "Tên quá ngắn" : "");
    }, [name]);

    useEffect(() => {
      setIsValid(nameError === "");
    }, [nameError]);

    return (/* ... */);
  }
  ```
