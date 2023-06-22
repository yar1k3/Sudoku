import logo from './logo.png';
import './App.css';
import { useState, useEffect } from 'react';

let lvl1 =
[
  [-1, 5, -1, 9, -1, -1, -1, -1, -1],
  [8, -1, -1, -1, 4, -1, 3, -1, 7],
  [-1, -1, -1, 2, 8, -1, 1, 9, -1],
  [5, 3, 8, 6, -1, 7, 9, 4, -1],
  [-1, 2, -1, 3, -1, 1, -1, -1, -1],
  [1, -1, 9, 8, -1, 4, 6, 2, 3],
  [9, -1, 7, 4, -1, -1, -1, -1, -1],
  [-1, 4, 5, -1, -1, -1, 2, -1, 9],
  [-1, -1, -1, -1, 3, -1, -1, 7, -1]
];

let lvl2 = [
  [5, 3, -1, -1, 7, -1,-1 ,-1 ,-1],
  [6, -1, -1, 1, 9, 5, -1, -1, -1],
  [-1, 9, 8, -1, -1, -1, -1, 6, -1],
  [8, -1, -1, -1, 6, -1, -1, -1, 3],
  [4, -1, -1, 8, -1, 3, -1, -1, 1],
  [7, -1, -1, -1, 2, -1, -1, -1, 6],
  [-1, 6, -1, -1, -1, -1, 2, 8, -1],
  [-1, -1, -1, 4, 1, 9, -1, -1, 5],
  [-1, -1, -1, -1, 8, -1, -1, 7, 9]
];

let lvl3 = [
  [9, -1, 6, -1, -1, -1,-1 ,-1 ,1],
  [-1, -1, -1, -1, -1, 6, -1, -1, -1],
  [-1, 7, 3, 8, 9, 1, -1, -1, 6],
  [-1, -1, -1, -1, 7, -1, -1, -1, -1],
  [2, -1, -1, 5, -1, 8, 6, -1, 4],
  [-1, -1, -1, 1, -1, -1, 9, -1, -1],
  [5, -1, -1, 9, 1, -1, 2, -1, -1],
  [-1, -1, -1, -1, 8, 7, -1, -1, -1],
  [1, 9, 7, 2, 5, -1, 8, -1, -1]
];

let initialField = lvl1;

let lvls = [lvl1, lvl2, lvl3]
//размер поля
const size = 9;
//размер квадрата
const squareSize = 3;

const Timer = () => {
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        const seconds = prevTime.seconds + 1;
        const minutes = prevTime.minutes + Math.floor(seconds / 60);
        return { minutes, seconds: seconds % 60 };
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <p className='timerLabel'>
        {time.minutes.toString().padStart(2, '0')}:
        {time.seconds.toString().padStart(2, '0')}
      </p>
    </div>
  );
};

function App() {

  

const cellsArray = [0,1,2,3,4,5,6,7,8];

  
//Функция, создающая полную (глубокую) копию массива
  function getDeepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  }

  //Хук useState
  const [fieldCells, setTestItems] = useState(getDeepCopy(initialField));

  //Функция, отрабатывающая при изменении клетки
  function inputAction(newValue, row, col) {
    var value = parseInt(newValue.target.value) || -1, fieldCopy = getDeepCopy(fieldCells);
    if (value === -1 || value > 0 && value <= 9) {
      fieldCopy[row][col] = value;
    }
    //Изменение значения fieldCells на fieldCopy
    setTestItems(fieldCopy)
  }

  //проверка введенных чисел
  function checkGame() {
    function compareTwoFields(currentField, solvedField) {
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (currentField[i][j] !== solvedField[i][j]) {
            return false
          }
        }
      }
      return true
    }

    let sudoku = getDeepCopy(initialField);
    solveSudoku(sudoku)
    let result = compareTwoFields(fieldCells, sudoku)
    if (result) {
      alert("Вы прошли этот уровень!")
    } else {
      alert("Что-то пошло не так, проверьте и попытайтесь снова!")
    }
  }

  //решение головоломки
  function solveSudoku(field) {


    //функция, для нахождения пустого поля
    function findEmpty(field) {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (field[r][c] === -1) {
            return [r, c]
          }
        }
      }
      return null
    }

    //функция для проверки числа
    function validCheck(num, pos, field) {
      const [r, c] = pos;

      //проверка строки
      for (let i = 0; i < size; i++) {
        if (field[i][c] === num && i !== r) {
          return false
        }
      }

      //проверка столбца
      for (let i = 0; i < size; i++) {
        if (field[r][i] === num && i !== c) {
          return false
        }
      }

       //проверка квадрата
      const rowStart = r - r%squareSize;
      const columnStart = c - c%squareSize;

      for (let i = rowStart; i < rowStart + squareSize; i++) {
        for (let j = columnStart; j < columnStart + squareSize; j++) {
          if (field[i][j] === num && i !== r && j !== c) {
            return false
          }
        }
      }

      return true
    }


    function solve(field) {
      const currentPos = findEmpty(field);
      
      //если пустого поля нет, то заканчиваем решение
      if (currentPos === null) {
        return true;
      }

      for (let i = 1; i < size + 1; i++) {
        const currentNum = i;
        const isValid = validCheck(currentNum, currentPos, field);

        if (isValid) {
          const [r,c] = currentPos;
          field[r][c] = currentNum;

          //проверка вставленного числа на дальнейшие итерации
          if (solve(field)) {
            return true
          }

          field[r][c] = -1;
        }
      }

      return false
    }

    solve(field)
  }

  function solveGame() {
    let sudoku = getDeepCopy(initialField);
    solveSudoku(sudoku);
    setTestItems(sudoku);
  }

  //перезапуск уровня
  function resetGame () {
    let gameField = getDeepCopy(initialField);
    setTestItems(gameField);
  }

  function changeLevel() {
    let newLvlIndex = Math.floor(Math.random() * lvls.length);
    while (initialField === lvls[newLvlIndex]) {
      newLvlIndex = Math.floor(Math.random() * lvls.length);
    }
    initialField = lvls[newLvlIndex];
    resetGame();
  }
  //работа с самим полем
  return (
    <div className="App">
      <div className="App-header">
        <h2 className='label'>Sudoku test app</h2>
        <Timer></Timer>         
        <table>
          {
            //строки
            cellsArray.map((row, rIndex) => {
              return <tr key={rIndex} className={(row + 1) % 3 === 0 ? 'bottom' : ''}>
                {
                //столбцы
                cellsArray.map((col, cIndex) => {
                  return <td key={rIndex + cIndex} className={(col + 1) % 3 === 0 ? 'right' : ''}>
                    <input onChange={(newValue) => inputAction(newValue, row, col)} 
                    value={fieldCells[row][col] === -1 ? '' : fieldCells[row][col]} 
                    className='CellInput'
                    disabled={initialField[row][col] !== -1} />
                  </td>
                })}
              </tr>
            })
          }
        </table>

        
        <div className='Buttons'>
          
          <button className='CheckButton' onClick={checkGame}>Проверить</button>
          <button className='SolveButton' onClick={solveGame}>Решение</button>
          <button className='ResetButton' onClick={resetGame}>Сбросить</button>
          <button className='SolveButton' onClick={changeLevel}>Cлед.уровень</button>

        </div>
      </div>
    </div>
  );
}

export default App;
