

(async () => {
  const scraper = await import("@scraper/index")
  const grouper = await import("@grouper/index")
  const checker = await import("@checker/index")
  const placer = await import("@placer/index")

  //await scraper.run()
  // await grouper.run()
   await checker.run()
  // await placer.run()

})()
