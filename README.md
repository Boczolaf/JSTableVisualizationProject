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
Pierwszym sposobem korzystania z biblioteki jest użycie funkcji  \textbf{insertDataTables(divId)}. Rozwiązanie to zapewnia interfejs oraz formatkę, które w pełni wykorzystują funkcjonalności biblioteki. Mając id div w którym chcemy utworzyć interfejs, zaimportowany skrypt  \textbf{library.js} oraz przypisaną odpowiednią funkcję przy ładowaniu, wystarczy tak jak wpliku  \textbf{new.html} w funkcji \textbf{loadMyFunctions()} użyć funkcji \textbf{insertDataTables(divId)}, gdzie \textbf{divId} to id div w którym ma zostać utworzony interfejs. 

-Korzystanie z wybranych funkcji}
Innym sposobem korzystania z biblioteki, jest dobranie odpowiadających do danego projektu funkcji. Rozwiązanie to zostało użyte na listingu ~\ref{lst:newhtml} dla div o id \textbf{"MyNewDiv1"} w celu utworzenia podstawowego interfejsu, tworzonego przez funkcję \textbf{insertDataTables(divId)}. Kod zamieszczony w tym listingu, w połączeniu ze skryptem w przykładowej funkcji \textbf{loadMyFunctions()} umożliwia tworzenie własnych interfejsów i formatek.
Aby rozpocząć proces tworzenia własnego interfejsu lub formatki wymagane jest aby wcześniej istniał div, w którym znajdować się będą wszystkie funkcjonalności.
Oprócz stworzenia div, należy tak jak na listingu ~\ref{lst:newhtml} w funkcji \textbf{loadMyFunctions()}, użyć funkcji \textbf{init(divId,canvasWidth,canvasHeight, editable)}, gdzie kolejno \textbf{divId} to id div w którym powstaje interfejs, \textbf{canvasWidth} to szerokość tworzonego elementu typu canvas, \textbf{canvasHeight} to wysokość elementu canvas, a \textbf{editable} to opcjonalnie id elementu typu input z którego mają być pobierane dane do edycji lub jeśli nie pożądana jest możliwość wprowadzania zmian -- pusty string. Dodatkowo, jeśli chcemy umożliwić edycję tabel, wymagane jest aby powstały odpowiednie elementy typu input, o następujących id, gdzie wszystkie wstawki z  \textbf{divId} oznaczją aby do danej nazwy dodać w kontekście łączenia stringów \textbf{divId}:
\begin{itemize}
    \item \textbf{tabName + divId} -- input ten służy do wpisywania nazwy tabel,
    \item \textbf{tabId + divId} -- input ten służy do wpisywania id tabeli do edycji,
     \item \textbf{tableType +divId} -- checkbox ten służy zaznaczania typu tabel (zaznaczony oznacza major),
      \item \textbf{colNames + divId} -- input ten służy do wpisywania po znaku ; nazwy kolumn typu in,
      \item \textbf{argNames + divId} -- input ten służy do wpisywania po znaku ; nazwy kolumn typu out,
      \item \textbf{rowCount + divId} -- input ten służy do wpisywania liczby wierszy.
\end{itemize}
## Źródła i inne
https://docs.google.com/document/d/1G-Bu3y2FyxGvGvYSgwIfbiWQJuW5nnagwibTRSHJejs/edit?usp=sharing

