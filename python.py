from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton, QMessageBox # import aplikacji desktopowej
from bs4 import BeautifulSoup #import bs4 
from html import escape # import funkcji html escape

# utworzenie aplikacji desktopowej
class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # Ustawienie tytułu i rozmiaru okna
        self.setWindowTitle('Aplikacja do książek')
        self.setGeometry(100, 100, 400, 200)

        # Tworzenie przycisku
        self.button = QPushButton('Pobierz książki', self)
        self.button.move(150, 80)
        self.button.clicked.connect(self.pobierz_ksiazki)

    def pobierz_ksiazki(self):
        try:
            # Adres pliku do przetworzenia
            url = './Bazydanych.htm'
            # otwieramy plik
            page = open(url)

            # przetwarzamy zawartość pliku
            soup = BeautifulSoup(page.read(), 'html.parser')

            # otwieramy plik książki.html w trybie zapisu i kodowaniu utf-8 i przypisujemy wynik do zmiennej f
            with open('książki.html', 'w', encoding='utf-8') as f:
                f.write(
                    '<html><head><title>Lista książek - ZADANIE PRAKTYKA - Dawid Grygorowicz 4Tp</title></head><body>')
                f.write(
                    '<center><h1>Lista książek</h1></center><center><table border="1">')

                # przeszukujemy stronę w poszukiwaniu elementów li z klasą classPresale
                for book in soup.find_all('li', class_='classPresale'):
                    # znajdujemy tytuł książki
                    title = book.find('a', class_='full-title-tooltip')
                    if title is not None:
                        title_text = title.text.strip()
                    else:
                        title_text = ''

                    # znajdujemy link przekierowywujący
                    klik = book.find('a', class_='show-short-desc')
                    if klik is not None:
                        klik_a = klik['href']
                    else:
                        klik_a = ''

                    # znajdujemy element z cenami książki
                    price_element = book.find('p', class_='price-incart')
                    if price_element is not None:
                        price = price_element.text.strip()
                    else:
                        price = 'Książka tymczasowo niedostępna!'

                    # znajdujemy okładkę książki i tworzymy kod HTML dla okładki
                    cover = book.find('img', class_='lazy')
                    if cover is not None:
                        cover_src = cover['data-src']
                        cover_html = f'<a href="{klik_a}"><img src="{cover_src}" alt="{title_text}"></a>'
                    else:
                        cover_html = 'Brak zdjęcia!'

                    # wstawiamy wiersz tabeli z kodem HTML dla okładki, tytułem książki i ceną książki
                    f.write('<tr>')
                    f.write(f'<td style="padding: 10px;">{cover_html}</td>')
                    f.write(f'<td><center>{escape(title_text)}</center></td>')
                    f.write(f'<td style="padding: 10px;"><center>{price}</center></td>')
                    f.write('</tr>')

                # koniec tabeli, koniec html
                f.write('</table></center>')
                f.write('</body></html>')

            # informacja o sukcesie
            QMessageBox.information(self, 'Sukces', 'Książki zostały pobrane i zapisane w pliku książki.html.')
        except:
            # informacja o błędzie
            QMessageBox.critical(self, 'Błąd', 'Wystąpił błąd podczas pobierania książek.')

# start aplikacji
if __name__ == '__main__':
    app = QApplication([])
    window = MainWindow()
    window.show()
    app.exec_()