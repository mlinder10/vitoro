# Medical Case Vignette Learning System

A modern, interactive web application for medical students to practice diagnostic reasoning and answer foundational questions based on clinical case presentations.

## Features

- **Interactive Case Presentation**: Displays detailed patient vignettes in a clean, readable format
- **Diagnosis Input**: Free-text input for students to submit their diagnostic reasoning
- **Immediate Feedback**: Reveals the correct diagnosis after submission
- **Progressive Question Reveal**: Questions appear one at a time after diagnosis submission
- **Rich Explanations**: Detailed explanations for each answer choice appear after selection
- **Visual Feedback**: Clear color coding for correct (green) and incorrect (red) answers
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Professional transitions and hover effects

## How It Works

1. **Case Presentation**: Students read the detailed patient vignette
2. **Diagnosis Submission**: Students enter their diagnosis in a free-text box
3. **Topic Revelation**: The correct diagnosis is revealed with a highlighted display
4. **Question Progression**: Multiple choice questions appear one at a time
5. **Answer Selection**: Students select their answer choice
6. **Explanation Display**: All explanations become visible with color-coded feedback
7. **Next Question**: Students can proceed to the next question when ready
8. **Completion**: A summary is shown when all questions are completed

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # Modern CSS styling and responsive design
├── script.js           # Interactive JavaScript functionality
├── questions.json      # Case data and questions
└── README.md           # This documentation
```

## Data Format

The system expects a JSON file with the following structure:

```json
{
  "topic": "Diagnosis Name",
  "base_case_vignette": {
    "vignette": "Detailed patient presentation..."
  },
  "questions": [
    {
      "axis": "Question Category",
      "question": "Question text...",
      "choices": ["A. Choice 1", "B. Choice 2", ...],
      "correct_answer": "A. Choice 1",
      "explanations": {
        "A": "Explanation for choice A",
        "B": "Explanation for choice B",
        ...
      }
    }
  ]
}
```

## Customization

### Adding New Cases

1. Create a new `questions.json` file with your case data
2. Update the HTML title and header if desired
3. The system will automatically load and display your new case

### Modifying the Design

- **Colors**: Update CSS variables in `styles.css`
- **Layout**: Modify the HTML structure in `index.html`
- **Functionality**: Extend the JavaScript in `script.js`

### Styling Options

The system includes:
- Modern gradient backgrounds
- Smooth hover effects and transitions
- Responsive design for all screen sizes
- Professional medical UI aesthetics
- Accessible color schemes

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Getting Started

1. **Local Development**: Simply open `index.html` in a web browser
2. **Web Server**: For production, serve the files from a web server
3. **Customization**: Modify the JSON data and styling as needed

## Keyboard Shortcuts

- **Ctrl + Enter**: Submit diagnosis (when input is active)
- **Enter**: Proceed to next question (when available)

## Future Enhancements

- Progress tracking and scoring
- Multiple case support
- User authentication
- Performance analytics
- Export functionality
- Accessibility improvements

## License

This project is open source and available under the MIT License.

## Support

For questions or customization requests, please refer to the code comments or create an issue in the project repository.


