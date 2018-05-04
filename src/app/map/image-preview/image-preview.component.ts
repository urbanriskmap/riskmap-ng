import { Component, OnInit, Input } from '@angular/core';

import { SanitizePipe } from '../../pipes/sanitize.pipe';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit {
  @Input() imgUrl: string;

  transformations = {
    1: '',
    2: 'rotateY(180deg)',
    3: 'rotate(180deg)',
    4: 'rotate(180deg) rotateY(180deg)',
    5: 'rotate(270deg) rotateY(180deg)',
    6: 'rotate(90deg)',
    7: 'rotate(90deg) rotateY(180deg)',
    8: 'rotate(270deg)'
  };

  constructor() { }

  ngOnInit() {
  }

  getOrientation(src: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const file = new File(['foo'], src);

      reader.onerror = reject;

      reader.onload = ({target}) => {
        try {
          const view = new DataView(target['result']);
          const length = view.byteLength;
          let offset = 2;

          if (view.getUint16(0, false) != 0xFFD8) {
            return reject(new Error('File is not a .jpeg'));
          }

          while (offset < length) {
            const marker = view.getUint16(offset, false);
            offset += 2;

            if (marker == 0xFFE1) {
              if (view.getUint32(offset += 2, false) != 0x45786966) {
                return resolve();
              }

              const little = view.getUint16(offset += 6, false) == 0x4949;
              offset += view.getUint32(offset + 4, little);

              const tags = view.getUint16(offset, little);
              offset += 2;

              for (let i = 0; i < tags; i++) {
                if (view.getUint16(offset + (i * 12), little) == 0x0112) {
                  return resolve(view.getUint16(offset + (i * 12) + 8, little));
                }
              }

            } else if ((marker & 0xFF00) != 0xFF00) {
              break;

            } else {
              offset += view.getUint16(offset, false);
            }
          }

          return resolve();
        } catch(error) {
          return reject(error);
        }
      };

      reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    });
  }
}
