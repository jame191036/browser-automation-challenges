def print_odd_even(n, limit): 
    # เช็กว่าเลขถ้าตัวแปล n มากกว่าตัวแปล limit ไหมถ้าเกินให้หยุดฟังก์ชั่น
    if n > limit:
        return

    # ตรวจสอบว่าตัวเลขในตัวแปล n หาร 2 แล้วมีเศษเป็น 0 ไหม ถ้าเศษ 0 ให้แสดงว่าเลขนี้เป็นเลขคู่
    if n % 2 == 0:
        print(f"{n} >> Even")
    else:
        print(f"{n} >> Odd")

    # เรียกใช้ function เลขถัดไป
    print_odd_even(n + 1, limit)

# Set the range from 1 to 100
start = 1
end = 100

# เรียกใช้ function
print_odd_even(start, end)

