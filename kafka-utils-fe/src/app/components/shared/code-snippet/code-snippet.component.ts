import { Component, Input, OnInit } from '@angular/core';
import { HighlightAuto } from 'ngx-highlightjs';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';
import { MatButtonModule } from '@angular/material/button';
import {JsonUtils} from "utils/JsonUtils";

@Component({
  selector: 'app-code-snippet',
  standalone: true,
  imports: [HighlightAuto, HighlightLineNumbers, MatButtonModule],
  templateUrl: './code-snippet.component.html',
  styleUrl: './code-snippet.component.scss',
})
export class CodeSnippetComponent implements OnInit {
  @Input() title: string;
  @Input() code: string;
  @Input() wrapCode = false;
  @Input() minVisibleLines = 10;
  @Input() showLineNumbers = true;

  codeFormatted: string;
  codeTruncated: string;
  showTruncated: boolean;

  ngOnInit(): void {
    const isCodeInJson = JsonUtils.isJson(this.code);

    if (!isCodeInJson) {
      this.codeFormatted = this.code;
      return;
    }

    this.codeFormatted = JSON.stringify(JSON.parse(this.code), null, 2);

    const jsonLines = this.codeFormatted.split('\n');
    const jsonShouldBeTruncated = jsonLines.length > this.minVisibleLines;

    this.codeTruncated = jsonShouldBeTruncated
      ? jsonLines.slice(0, this.minVisibleLines).join('\n')
      : null;
    this.showTruncated = jsonShouldBeTruncated;
  }

  toggleShowTruncated() {
    this.showTruncated = !this.showTruncated;
  }
}
