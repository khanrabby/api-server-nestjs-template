const sum = (a, b)=>{
    return a+b;
}

test('expect sum to be right', () => {

    expect(sum(1, 2)).toBe(3);
});
