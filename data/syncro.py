import os, subprocess, logging
logging.basicConfig(level=logging.INFO)

from datetime import date, datetime

from apscheduler.schedulers.blocking import BlockingScheduler
logging.getLogger('apscheduler.executors.default').propagate = False

def sync_that_stuff():

        today = date.today()
        now = datetime.now()

        dbDir = './db/'
        mountpointDir = './db_backup_mountp/'
        dateDir = str(today.year)+'-'+str(today.month)+'-'+str(today.day)+'/'

        buDirPath = os.path.join(mountpointDir, dateDir)

        subprocess.call(['rsync', '-r', '--mkpath', dbDir, buDirPath])
        logging.info(f' {now}: 🤖 sync complete')


if __name__ == "__main__":

    scheduler = BlockingScheduler(timezone="Europe/Berlin")
    scheduler.add_job(sync_that_stuff, 'cron', day_of_week='mon-sun', hour=9, minute=1)
    scheduler.start()
