shinyServer(function(input, output, session) {
  output$mychart <- renderLineChart({
    structure(
      data.frame(
        sin(1:100/10 + input$sinePhase * pi/180) * input$sineAmplitude,
        0.5 * cos(1:100/10),
        sin(1:100/10) * 0.25 + 0.5
      ),
      names = c("Sine wave", "Cosine wave", "Another sine wave")
    )
  })
})
