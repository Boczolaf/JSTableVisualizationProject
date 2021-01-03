# Komponent JS do wizualizacji i interakcji z CoNDeT


## Spełnione Wymagania:
-struktura projektu jako open source biblioteka JS  
-tworzenie tabel pozwalających na wizualizację wprowadzonych danych regułowych  
-dodawanie nowych tabel poprzez oddzielnie wywoływaną formatkę pozwalającą zdefiniować konkretne kolumny  
-modyfikacja tabel poprzez dodawanie lub usuwanie wierszy  
-modyfikacja tabel poprzez edycję atrybutów wykonywaną w osobnej formatce (ta sama jak do dodwania nowych tabel)  
-możliwość operowania na zawartości tabel(przejścia pomiędzy komórkami, otwarcie edycji komórki itp.) przy pomocy klawiatury  
-możliwość zdefiniowania powiązań pomiędzy elementami tabel i innymi tabelami, wizualizacja połączeń, możliwość stworzenia połączeń jeden do wielu  
-funkcja undo  
-funkcja redo  
-zapis struktury tabel do pliku json  
-odczyt z pliku json do stworzenia struktury tabel  
-nawigacja z klawiatury
## Plany na rozwój:
1. Łączenie tabel za pocą drag&drop
2. Inteligente połączenia
## Sposób użycia
W celu skorzystania z biblioteki należy ją pobrać, po czym skorzystać z dwóch poniższych sposobów:

-Użycie funkcji zapewnianiej przez bibiliotekę

Pierwszym sposobem korzystania z biblioteki jest użycie funkcji  insertDataTables(divId). Rozwiązanie to zapewnia interfejs oraz formatkę, które w pełni wykorzystują funkcjonalności biblioteki. Mając id div w którym chcemy utworzyć interfejs, zaimportowany skrypt  library.js oraz przypisaną odpowiednią funkcję przy ładowaniu, wystarczy tak jak wpliku  new.html} w funkcji loadMyFunctions() użyć funkcjiinsertDataTables(divId), gdzie divId to id div w którym ma zostać utworzony interfejs. 

-Korzystanie z wybranych funkcji

Innym sposobem korzystania z biblioteki, jest dobranie odpowiadających do danego projektu funkcji. Rozwiązanie to zostało użyte na listingu ~\ref{lst:newhtml} dla div o id "MyNewDiv1" w celu utworzenia podstawowego interfejsu, tworzonego przez funkcję insertDataTables(divId). Kod zamieszczony w tym listingu, w połączeniu ze skryptem w przykładowej funkcji loadMyFunctions() umożliwia tworzenie własnych interfejsów i formatek.
Aby rozpocząć proces tworzenia własnego interfejsu lub formatki wymagane jest aby wcześniej istniał div, w którym znajdować się będą wszystkie funkcjonalności.
Oprócz stworzenia div, należy tak jak w pliku new.html w funkcji loadMyFunctions(), użyć funkcjiinit(divId,canvasWidth,canvasHeight, editable), gdzie kolejno divId to id div w którym powstaje interfejs, canvasWidth to szerokość tworzonego elementu typu canvas, canvasHeight to wysokość elementu canvas, a editable to opcjonalnie id elementu typu input z którego mają być pobierane dane do edycji lub jeśli nie pożądana jest możliwość wprowadzania zmian -- pusty string. Dodatkowo, jeśli chcemy umożliwić edycję tabel, wymagane jest aby powstały odpowiednie elementy typu input, o następujących id, gdzie wszystkie wstawki z  divId oznaczją aby do danej nazwy dodać w kontekście łączenia stringów divId:

-tabName + divId -- input ten służy do wpisywania nazwy tabel,

-tabId + divId -- input ten służy do wpisywania id tabeli do edycji,

-tableType +divId -- checkbox ten służy zaznaczania typu tabel (zaznaczony oznacza major),

-colNames + divId -- input ten służy do wpisywania po znaku ; nazwy kolumn typu warunkowego,

-argNames + divId -- input ten służy do wpisywania po znaku ; nazwy kolumn typu decyzyjnego,

-rowCount + divId -- input ten służy do wpisywania liczby wierszy.

Lista funkcji:

-editTableById(divId) -- funkcja ta po sprawdzeniu czy tablica należy do odpowiedniego diva, zmienia wyświetlanie się elementu o id tableType + getDivInnerId(divId) na ukryty, w celu zmiany formatki na formatkę do edycji. Dodatkowo, funkcja zmienia funkcję onlclick elementu o id addButton + getDivInnerId(divId) na funkcję aplikującą zmiany w tabeli, takie jak zmiana nazwy, dodanie kolumn i/lub wierszy przez edycję inputu o id colNames + getDivInnerId(divId), inputu argNames + getDivInnerId(divId), oraz o edycję inputu rowCount + getDivInnerId(divId).

-setupMainDiv(divId) -- funkcja ta tworzy nową tabelę w div id równym divId, pobierając informację z inputu o id tabName + getDivInnerId(divId), inputu o id  colNames +            getDivInnerId(divId), inputu argNames + getDivInnerId(divId), inputu o id rowCount + getDivInnerId(divId) oraz z checkbox'a o id tableType + getDivInnerId(divId).

-toJson(divId,download) -- funkcja ta zapisuje wszystkie tabele z div o id równym divId, do formatu .json, po czym jeśli download równy jest prawdzie, rozpoczyna pobieranie        utworzonego pliku. Jeśli jednak download jest ustawiony jako fałsz, funkcja zwróci obiekt .json.

-fromJson(divId,input) -- funkcja ta odczytuje wybrany w elemencie input o id input, plik .json lub jeśli nie jest to input, czyta wprost z elementu. Następnie funkcja ta          czyści wszystkie tablice z div o id równym divId, po czym wczytuje wszystkie tablice z pliku lub z wejścia .json.

-undo(divId) -- funkcje dodające lub zmieniające tablice dodają do pamięci informację o zmianach. Funkcja ta odczytuje ostatnią zmianę w div o id równym divId,po czym              przywraca stan do stanu przed zmianą.

 -redo(divId) -- funkcja ta odczytuje ostatnią cofniętą zmianę w div o id równym divId, po czym przywraca stan do stanu po zmianie.
 
 -switchDeleteMode(divId) -- funckcja ta przełącza deleteMode dla div o id równym divId. Tryb usuwania (deleteMode) odpowiada za ukrycie lub ukazanie przycisków do usuwania        kolumn i wierszy.

## Źródła i inne
https://docs.google.com/document/d/1G-Bu3y2FyxGvGvYSgwIfbiWQJuW5nnagwibTRSHJejs/edit?usp=sharing

