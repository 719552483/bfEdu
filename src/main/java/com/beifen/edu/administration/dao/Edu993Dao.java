package com.beifen.edu.administration.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu993;

public interface Edu993Dao extends JpaRepository<Edu993, Long>, JpaSpecificationExecutor<Edu993> {

	// 根据id获取通知
	@Query(value = "select * from edu993 e where e.Edu993_ID=?1", nativeQuery = true)
	public Edu993 getNoteInfoById(String noteId);

	// 改变通知是否首页展示
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu993 SET sfsyzs=?2 WHERE Edu993_ID =?1", nativeQuery = true)
	public void changeNoticeIsShowIndex(String noticeId, String isShow);

	//删除通知
	@Transactional
	@Modifying
	@Query(value = "delete from edu993 where Edu993_ID =?1", nativeQuery = true)
	public void removeNotices(String edu990id);

}
